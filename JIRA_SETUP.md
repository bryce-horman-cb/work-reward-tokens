# 🎯 Jira Reward Service Setup Guide

## Quick Start

1. **Update Configuration** in `jira-service.js`:

```javascript
// Replace these values in jira-service.js:
const JIRA_CONFIG = {
  baseUrl: "https://YOUR-DOMAIN.atlassian.net", // Your actual Jira domain
  email: "your-email@company.com", // Your Jira email
  apiToken: "your-jira-api-token", // Generate from Jira settings
  projectKey: "YOUR-PROJECT", // Your project key (e.g., 'DEV', 'TEAM')
};

const USER_MAPPING = {
  "user@company.com": "0xA0683E63BECD308E90f0e864a1a3F710af85E6F4", // Email → Wallet mapping
};
```

2. **Add to your `.env` file**:

```bash
PRIVATE_KEY=your_wallet_private_key_here
```

3. **Generate Jira API Token**:

   - Go to: https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Copy the token and update `jira-service.js`

4. **Run the service**:

```bash
node jira-service.js
```

## How It Works

### 🔄 **Polling Cycle (Every 30 seconds)**

1. Query Jira API for tickets completed in last 24 hours
2. Filter for new tickets (not processed in current session)
3. Award 1 WORK token per completed ticket
4. Track processed tickets in memory

### 📋 **Jira Query**

```sql
project = YOUR-PROJECT AND status = Done AND resolved >= -1d ORDER BY resolved DESC
```

### 🎁 **Token Award**

- **Amount**: 1 WORK token per completed ticket
- **Activity ID**: `jira-{ticket-key}` (e.g., `jira-DEV-123`)
- **Platform**: `"Jira"`

## Example Output

```
🚀 Starting Jira Reward Service...
⏰ Will check for completed tickets every 30 seconds
🔍 Checking for recently completed Jira tickets...
📋 Found 2 recently completed tickets
🎯 Processing ticket DEV-123 assigned to user@company.com
📋 Ticket: Fix authentication bug
📅 Completed: 2024-01-15T10:30:00.000Z
🔗 Awarding 1 WORK token to 0xA0683E63BECD308E90f0e864a1a3F710af85E6F4 for ticket DEV-123...
📋 Transaction sent: 0x1234...abcd
✅ Transaction confirmed in block 12345
🎉 Successfully awarded 1 WORK token for ticket DEV-123
🔗 Transaction: https://sepolia.basescan.org/tx/0x1234...abcd
```

## Configuration Options

### Jira Settings

- **Project Key**: Filter tickets by specific project
- **Time Range**: Currently set to last 24 hours (`-1d`)
- **Status**: Only processes tickets with status "Done"

### Token Awards

- **Fixed Amount**: 1 WORK token per ticket
- **Duplicate Prevention**: In-memory tracking prevents double-awards
- **Smart Contract**: Uses your deployed WorkRewards contract

## Next Steps

1. **Test with hardcoded values first**
2. **Add more users to USER_MAPPING**
3. **Consider moving config to environment variables**
4. **Add error handling and retry logic**
5. **Add webhook endpoint for real-time updates**

## Troubleshooting

### Common Issues

- **"PRIVATE_KEY not set"**: Add your wallet private key to `.env`
- **"Please update JIRA_CONFIG"**: Replace placeholder values in `jira-service.js`
- **"No tickets found"**: Check your Jira project key and permissions
- **"Transaction failed"**: Ensure your wallet has ETH for gas fees

### Testing Jira Connection

```bash
# Test Jira API access manually:
curl -u "your-email@company.com:your-api-token" \
  "https://your-domain.atlassian.net/rest/api/3/search?jql=project=YOUR-PROJECT"
```
