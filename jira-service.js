require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios");
const { ethers } = require("ethers");

// ==========================================
// CONFIGURATION (Make these environment variables later)
// ==========================================

// Hardcoded for now - move to .env later
const JIRA_CONFIG = {
  baseUrl: "https://your-domain.atlassian.net", // Replace with your Jira domain
  email: "your-email@company.com", // Your Jira email
  apiToken: "your-jira-api-token", // Your Jira API token
  projectKey: "PROJ", // Your project key (e.g., 'DEV', 'TEAM', etc.)
};

// Hardcoded user mapping (move to database later)
const USER_MAPPING = {
  "user@company.com": "0xA0683E63BECD308E90f0e864a1a3F710af85E6F4", // Replace with actual mapping
};

// Smart contract configuration
const CONTRACT_CONFIG = {
  workRewardsAddress: "0x6D7cbF6b2D2863C5de75eD7D938Ae13F390373AD",
  rpcUrl: "https://sepolia.base.org",
  privateKey: process.env.PRIVATE_KEY, // Private key of contract owner
};

// ABI for WorkRewards contract (just the awardTokens function)
const WORK_REWARDS_ABI = [
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
      { internalType: "string", name: "activityId", type: "string" },
      { internalType: "string", name: "platform", type: "string" },
    ],
    name: "awardTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ==========================================
// IN-MEMORY TRACKING
// ==========================================

// Simple in-memory tracking to avoid duplicate awards within the session
const processedTickets = new Set();

// ==========================================
// JIRA API CLIENT
// ==========================================

class JiraClient {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.auth = {
      username: config.email,
      password: config.apiToken,
    };
  }

  // Get completed tickets from the last day
  async getRecentlyCompletedTickets() {
    try {
      // JQL query for tickets completed in the last day
      const jql = `project = ${JIRA_CONFIG.projectKey} AND status = Done AND resolved >= -1d ORDER BY resolved DESC`;

      const response = await axios.get(`${this.baseUrl}/rest/api/3/search`, {
        auth: this.auth,
        params: {
          jql: jql,
          fields: "key,assignee,resolution,resolutiondate,created,summary",
          maxResults: 50,
        },
      });

      return response.data.issues;
    } catch (error) {
      console.error(
        "Error fetching Jira tickets:",
        error.response?.data || error.message
      );
      return [];
    }
  }
}

// ==========================================
// BLOCKCHAIN CLIENT
// ==========================================

class BlockchainClient {
  constructor(config) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.contract = new ethers.Contract(
      config.workRewardsAddress,
      WORK_REWARDS_ABI,
      this.wallet
    );
  }

  // Award 1 WORK token for completing a Jira ticket
  async awardTokensForTicket(recipientAddress, ticketKey) {
    try {
      const tokenAmount = ethers.parseEther("1"); // 1 WORK token
      const activityId = `jira-${ticketKey}`;
      const platform = "Jira";

      console.log(
        `🔗 Awarding 1 WORK token to ${recipientAddress} for ticket ${ticketKey}...`
      );

      const tx = await this.contract.awardTokens(
        recipientAddress,
        tokenAmount,
        activityId,
        platform
      );

      console.log(`📋 Transaction sent: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error(
        `❌ Error awarding tokens for ticket ${ticketKey}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }
}

// ==========================================
// MAIN SERVICE
// ==========================================

class JiraRewardService {
  constructor() {
    this.jiraClient = new JiraClient(JIRA_CONFIG);
    this.blockchainClient = new BlockchainClient(CONTRACT_CONFIG);
  }

  async processRecentTickets() {
    try {
      console.log("🔍 Checking for recently completed Jira tickets...");

      // Get recently completed tickets from Jira
      const tickets = await this.jiraClient.getRecentlyCompletedTickets();

      if (tickets.length === 0) {
        console.log("📝 No recently completed tickets found.");
        return;
      }

      console.log(`📋 Found ${tickets.length} recently completed tickets`);

      for (const ticket of tickets) {
        await this.processTicket(ticket);
      }
    } catch (error) {
      console.error("❌ Error in processRecentTickets:", error.message);
    }
  }

  async processTicket(ticket) {
    const ticketKey = ticket.key;
    const assigneeEmail = ticket.fields.assignee?.emailAddress;

    // Skip if no assignee
    if (!assigneeEmail) {
      console.log(`⚠️  Skipping ${ticketKey} - no assignee`);
      return;
    }

    // Skip if already processed in this session
    if (processedTickets.has(ticketKey)) {
      console.log(
        `⏭️  Skipping ${ticketKey} - already processed in this session`
      );
      return;
    }

    // Get wallet address for this user
    const walletAddress = USER_MAPPING[assigneeEmail];
    if (!walletAddress) {
      console.log(
        `⚠️  Skipping ${ticketKey} - no wallet mapping for ${assigneeEmail}`
      );
      return;
    }

    console.log(
      `🎯 Processing ticket ${ticketKey} assigned to ${assigneeEmail}`
    );
    console.log(`📋 Ticket: ${ticket.fields.summary}`);
    console.log(`📅 Completed: ${ticket.fields.resolutiondate}`);

    // Award tokens via smart contract
    const result = await this.blockchainClient.awardTokensForTicket(
      walletAddress,
      ticketKey
    );

    if (result.success) {
      // Mark as processed
      processedTickets.add(ticketKey);
      console.log(
        `🎉 Successfully awarded 1 WORK token for ticket ${ticketKey}`
      );
      console.log(
        `🔗 Transaction: https://sepolia.basescan.org/tx/${result.txHash}`
      );
    } else {
      console.log(
        `❌ Failed to award tokens for ticket ${ticketKey}: ${result.error}`
      );
    }

    console.log("---");
  }

  start() {
    console.log("🚀 Starting Jira Reward Service...");
    console.log("⏰ Will check for completed tickets every 30 seconds");

    // Validate configuration
    if (!CONTRACT_CONFIG.privateKey) {
      console.error("❌ PRIVATE_KEY environment variable not set!");
      process.exit(1);
    }

    if (JIRA_CONFIG.baseUrl.includes("your-domain")) {
      console.error(
        "❌ Please update JIRA_CONFIG with your actual Jira domain!"
      );
      process.exit(1);
    }

    // Run immediately on start
    this.processRecentTickets();

    // Schedule to run every 30 seconds
    cron.schedule("*/30 * * * * *", () => {
      this.processRecentTickets();
    });

    console.log("✅ Jira Reward Service started successfully!");
  }
}

// ==========================================
// START THE SERVICE
// ==========================================

if (require.main === module) {
  const service = new JiraRewardService();
  service.start();
}

module.exports = JiraRewardService;
