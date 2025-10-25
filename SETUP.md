# Slack Automation Setup Guide

This guide will walk you through setting up your Slack automation for content repurposing.

## Prerequisites

- Node.js 18+ installed
- A Slack workspace where you have admin permissions
- Access to create Slack apps at https://api.slack.com/apps

## Step 1: Create a Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter an app name (e.g., "Content Repurposing Bot")
5. Select your workspace
6. Click **"Create App"**

## Step 2: Configure Bot Scopes

These are the **REQUIRED** permissions for your bot to work:

1. In your app settings, go to **"OAuth & Permissions"** (left sidebar)
2. Scroll down to **"Scopes"** → **"Bot Token Scopes"**
3. Click **"Add an OAuth Scope"** and add the following:

### Required Bot Token Scopes:
```
channels:history     - View messages in public channels
channels:read        - View basic channel information
chat:write          - Send messages as the bot
chat:write.public   - Send messages to channels the bot isn't a member of
app_mentions:read   - View messages that mention your app
commands            - Add slash commands
```

### Optional (but recommended):
```
users:read          - View people in the workspace
reactions:write     - Add emoji reactions
files:write         - Upload files
```

## Step 3: Enable Event Subscriptions

1. Go to **"Event Subscriptions"** in the left sidebar
2. Toggle **"Enable Events"** to **On**
3. In **"Request URL"**, you'll need to enter your server URL:
   - For local development with ngrok: `https://your-ngrok-url.ngrok.io/slack/events`
   - For production: `https://your-domain.com/slack/events`

   **NOTE:** You must have your server running first! Slack will verify the URL immediately.

4. Under **"Subscribe to bot events"**, add these events:
   ```
   message.channels    - Listen to messages in channels
   app_mention        - Listen to app mentions
   ```

5. Click **"Save Changes"**

## Step 4: Enable Interactivity (Optional)

If you want to use buttons and interactive components:

1. Go to **"Interactivity & Shortcuts"** in the left sidebar
2. Toggle **"Interactivity"** to **On**
3. Enter your **Request URL**: `https://your-domain.com/slack/interactive`
4. Click **"Save Changes"**

## Step 5: Create Slash Commands (Optional)

1. Go to **"Slash Commands"** in the left sidebar
2. Click **"Create New Command"**
3. Fill in the details:
   - Command: `/repurpose`
   - Request URL: `https://your-domain.com/slack/commands`
   - Short Description: "Repurpose content"
   - Usage Hint: "[content to repurpose]"
4. Click **"Save"**

## Step 6: Install the App to Your Workspace

1. Go to **"OAuth & Permissions"** in the left sidebar
2. Click **"Install to Workspace"**
3. Review the permissions and click **"Allow"**
4. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)
   - You'll need this for your `.env` file

## Step 7: Invite the Bot to Your Channel

Your channel ID is: **C09JR1V8139**

1. Open the Slack channel where you want the bot to operate
2. Type: `/invite @YourBotName` (replace with your bot's name)
3. Or click the channel name → Integrations → Add apps → Find your bot

## Step 8: Configure Your Local Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token-from-step-6
   SLACK_CHANNEL_ID=C09JR1V8139
   SLACK_SIGNING_SECRET=your-signing-secret-from-app-credentials
   ```

   **Where to find these:**
   - **Bot Token:** OAuth & Permissions → Bot User OAuth Token
   - **Channel ID:** Already set to `C09JR1V8139`
   - **Signing Secret:** Basic Information → App Credentials → Signing Secret

## Step 9: Run the Application

### For Development (local testing):

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. The server will start on `http://localhost:3000`

### For Production:

You'll need to deploy this to a server that's publicly accessible. Options include:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

## Step 10: Expose Your Local Server (for testing)

If you're testing locally, you need to expose your server to the internet:

### Using ngrok:
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000
```

This will give you a URL like `https://abc123.ngrok.io`

Use this URL when configuring:
- Event Subscriptions Request URL: `https://abc123.ngrok.io/slack/events`
- Interactivity Request URL: `https://abc123.ngrok.io/slack/interactive`
- Slash Commands Request URL: `https://abc123.ngrok.io/slack/commands`

## Testing Your Setup

1. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Test posting a message:**
   ```bash
   curl -X POST http://localhost:3000/test/message \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello from the automation!"}'
   ```

3. **Test in Slack:**
   - Send a message in your channel (C09JR1V8139)
   - Mention your bot: `@YourBot hello`
   - Use the slash command: `/repurpose test content`

## Troubleshooting

### "Channel not found" error
- **Cause:** The bot isn't invited to the channel, or channel ID is wrong
- **Fix:**
  1. Double-check the channel ID: `C09JR1V8139`
  2. Invite the bot: `/invite @YourBot` in the channel
  3. Verify bot has `channels:read` and `chat:write` scopes

### "Not in channel" error
- **Cause:** Bot needs to be explicitly invited
- **Fix:** Add the `chat:write.public` scope OR invite the bot to the channel

### "Invalid token" error
- **Cause:** Wrong bot token or token not set
- **Fix:**
  1. Check `.env` has `SLACK_BOT_TOKEN=xoxb-...`
  2. Verify token from OAuth & Permissions page
  3. Make sure token starts with `xoxb-` (not `xoxp-`)

### Events not being received
- **Cause:** Event subscription URL not verified
- **Fix:**
  1. Make sure server is running BEFORE saving Event Subscriptions
  2. Check server logs for incoming requests
  3. Verify the URL is publicly accessible (use ngrok for local testing)
  4. Check that events are subscribed: `message.channels`, `app_mention`

### Slash command not working
- **Cause:** Command not registered or wrong URL
- **Fix:**
  1. Verify slash command is created in app settings
  2. Check Request URL matches your server
  3. Make sure server is running and accessible

## Channel ID Format

Your channel ID `C09JR1V8139` is correct. Slack channel IDs:
- Start with `C` for public channels
- Start with `G` for private channels
- Start with `D` for DMs
- Contain alphanumeric characters

## Key Bot Scopes Summary

If you're having permission issues, make sure you have AT MINIMUM:

✅ `channels:history`
✅ `channels:read`
✅ `chat:write`
✅ `chat:write.public` (if not inviting bot to channel)
✅ `app_mentions:read`

After adding new scopes, you MUST:
1. Click "Save Changes"
2. **Reinstall the app** (OAuth & Permissions → Reinstall to Workspace)

## Need Help?

Check the logs when your server is running:
```bash
npm start
```

The logs will show:
- Incoming events
- Error messages
- API responses from Slack
