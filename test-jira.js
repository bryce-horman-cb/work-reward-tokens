require("dotenv").config();
const axios = require("axios");

// ==========================================
// TEST CONFIGURATION
// ==========================================

// Update these values to match your Jira setup
const JIRA_CONFIG = {
  baseUrl: "https://your-domain.atlassian.net", // Replace with your Jira domain
  email: "your-email@company.com", // Your Jira email
  apiToken: "your-jira-api-token", // Your Jira API token
  projectKey: "PROJ", // Your project key
};

// ==========================================
// TEST FUNCTIONS
// ==========================================

async function testJiraConnection() {
  console.log("🧪 Testing Jira API Connection...\n");

  try {
    // Test basic authentication
    console.log("1. Testing authentication...");
    const authResponse = await axios.get(
      `${JIRA_CONFIG.baseUrl}/rest/api/3/myself`,
      {
        auth: {
          username: JIRA_CONFIG.email,
          password: JIRA_CONFIG.apiToken,
        },
      }
    );

    console.log(`✅ Authentication successful!`);
    console.log(
      `   User: ${authResponse.data.displayName} (${authResponse.data.emailAddress})\n`
    );

    // Test project access
    console.log("2. Testing project access...");
    const projectResponse = await axios.get(
      `${JIRA_CONFIG.baseUrl}/rest/api/3/project/${JIRA_CONFIG.projectKey}`,
      {
        auth: {
          username: JIRA_CONFIG.email,
          password: JIRA_CONFIG.apiToken,
        },
      }
    );

    console.log(`✅ Project access successful!`);
    console.log(
      `   Project: ${projectResponse.data.name} (${projectResponse.data.key})\n`
    );

    // Test recent tickets query
    console.log("3. Testing recent completed tickets query...");
    const jql = `project = ${JIRA_CONFIG.projectKey} AND status = Done AND resolved >= -7d ORDER BY resolved DESC`;

    const ticketsResponse = await axios.get(
      `${JIRA_CONFIG.baseUrl}/rest/api/3/search`,
      {
        auth: {
          username: JIRA_CONFIG.email,
          password: JIRA_CONFIG.apiToken,
        },
        params: {
          jql: jql,
          fields: "key,assignee,resolution,resolutiondate,created,summary",
          maxResults: 10,
        },
      }
    );

    console.log(`✅ Query successful!`);
    console.log(
      `   Found ${ticketsResponse.data.total} completed tickets in last 7 days`
    );

    if (ticketsResponse.data.issues.length > 0) {
      console.log(`   Recent tickets:`);
      ticketsResponse.data.issues.forEach((ticket, index) => {
        const assignee = ticket.fields.assignee?.emailAddress || "Unassigned";
        const resolved = new Date(
          ticket.fields.resolutiondate
        ).toLocaleDateString();
        console.log(
          `   ${index + 1}. ${ticket.key} - ${assignee} (${resolved})`
        );
      });
    } else {
      console.log(`   ⚠️  No completed tickets found in the last 7 days`);
    }

    console.log(
      "\n🎉 All tests passed! Your Jira configuration is working correctly."
    );
    console.log(
      "\n🚀 You can now run the main service with: node jira-service.js"
    );
  } catch (error) {
    console.error("\n❌ Test failed!");

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.errorMessages?.[0] ||
        error.response.data?.message ||
        "Unknown error";

      console.error(`   HTTP ${status}: ${message}`);

      if (status === 401) {
        console.error("\n💡 Tips for 401 Unauthorized:");
        console.error("   - Check your email and API token are correct");
        console.error(
          "   - Regenerate your API token at: https://id.atlassian.com/manage-profile/security/api-tokens"
        );
      } else if (status === 404) {
        console.error("\n💡 Tips for 404 Not Found:");
        console.error("   - Check your Jira domain URL is correct");
        console.error("   - Verify the project key exists and you have access");
      } else if (status === 403) {
        console.error("\n💡 Tips for 403 Forbidden:");
        console.error(
          "   - You may not have permission to access this project"
        );
        console.error("   - Contact your Jira admin to grant project access");
      }
    } else {
      console.error(`   ${error.message}`);

      if (error.code === "ENOTFOUND") {
        console.error("\n💡 Tips for connection errors:");
        console.error("   - Check your Jira domain URL is correct");
        console.error("   - Ensure you have internet connectivity");
      }
    }

    console.error(
      "\n📝 Please fix the configuration in test-jira.js and try again."
    );
  }
}

// ==========================================
// VALIDATION
// ==========================================

function validateConfig() {
  console.log("🔍 Validating configuration...\n");

  const issues = [];

  if (JIRA_CONFIG.baseUrl.includes("your-domain")) {
    issues.push("❌ baseUrl: Update with your actual Jira domain");
  }

  if (JIRA_CONFIG.email.includes("your-email")) {
    issues.push("❌ email: Update with your actual Jira email");
  }

  if (JIRA_CONFIG.apiToken.includes("your-jira")) {
    issues.push("❌ apiToken: Update with your actual Jira API token");
  }

  if (JIRA_CONFIG.projectKey === "PROJ") {
    issues.push(
      "⚠️  projectKey: Consider updating with your actual project key"
    );
  }

  if (issues.length > 0) {
    console.log("Configuration issues found:");
    issues.forEach((issue) => console.log(`  ${issue}`));
    console.log(
      "\nPlease update the JIRA_CONFIG object in this file and try again.\n"
    );
    return false;
  }

  console.log("✅ Configuration looks good!\n");
  return true;
}

// ==========================================
// RUN TEST
// ==========================================

async function main() {
  console.log("🧪 Jira Integration Test\n");
  console.log("=".repeat(50));

  if (validateConfig()) {
    await testJiraConnection();
  }
}

if (require.main === module) {
  main();
}
