# Slack Automation - Content Repurposing Webhook

A Node.js/TypeScript webhook server for Slack that enables automated content repurposing workflows.

## Features

- Webhook-based Slack event handling
- Support for slash commands
- Interactive components (buttons, modals)
- Message processing in specific channels
- Bot mentions handling
- TypeScript for type safety
- Express.js server with health checks

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Slack credentials
   ```

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

4. **For development:**
   ```bash
   npm run dev
   ```

## Configuration

Your channel ID is already configured: `C09JR1V8139`

See [SETUP.md](./SETUP.md) for complete setup instructions including:
- Creating a Slack app
- Required bot scopes
- Event subscriptions
- Webhook configuration
- Troubleshooting guide

## Endpoints

- `GET /health` - Health check endpoint
- `POST /slack/events` - Slack Events API webhook
- `POST /slack/interactive` - Interactive components webhook
- `POST /slack/commands` - Slash commands webhook
- `POST /test/message` - Test endpoint to post messages

## Required Bot Scopes

At minimum, your bot needs:
- `channels:history`
- `channels:read`
- `chat:write`
- `chat:write.public`
- `app_mentions:read`

## Documentation

- [Complete Setup Guide](./SETUP.md) - Step-by-step instructions
- [Slack API Documentation](https://api.slack.com/docs)

## Troubleshooting

If the bot isn't working:
1. Check the bot is invited to channel `C09JR1V8139`
2. Verify bot scopes are configured correctly
3. Ensure `SLACK_BOT_TOKEN` is set in `.env`
4. Check server logs for errors

See [SETUP.md](./SETUP.md) for detailed troubleshooting.