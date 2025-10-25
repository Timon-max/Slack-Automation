import express, { Request, Response } from 'express';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Slack Web API client
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Slack Events API endpoint
app.post('/slack/events', async (req: Request, res: Response) => {
  try {
    const { type, challenge, event } = req.body;

    // Respond to Slack's URL verification challenge
    if (type === 'url_verification') {
      console.log('URL verification challenge received');
      return res.status(200).json({ challenge });
    }

    // Handle Slack events
    if (type === 'event_callback') {
      // Acknowledge the event immediately
      res.status(200).send();

      // Process the event asynchronously
      handleSlackEvent(event);
      return;
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error handling Slack event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Slack Interactive endpoint (for buttons, modals, etc.)
app.post('/slack/interactive', async (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.payload);

    // Acknowledge the interaction immediately
    res.status(200).send();

    // Process the interaction asynchronously
    handleSlackInteraction(payload);
  } catch (error) {
    console.error('Error handling Slack interaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Slack Slash Command endpoint
app.post('/slack/commands', async (req: Request, res: Response) => {
  try {
    const { command, text, user_id, channel_id } = req.body;

    console.log(`Received command: ${command} from user ${user_id} in channel ${channel_id}`);

    // Process different commands
    if (command === '/repurpose') {
      await handleRepurposeCommand(text, channel_id, user_id);
      res.status(200).json({
        response_type: 'in_channel',
        text: 'Content repurposing started!'
      });
    } else {
      res.status(200).json({
        response_type: 'ephemeral',
        text: 'Unknown command'
      });
    }
  } catch (error) {
    console.error('Error handling Slack command:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle Slack events
async function handleSlackEvent(event: any) {
  try {
    const { type, channel, user, text, ts } = event;

    console.log(`Event received: ${type} in channel ${channel}`);

    // Ignore bot messages to prevent loops
    if (event.bot_id) {
      console.log('Ignoring bot message');
      return;
    }

    // Handle different event types
    switch (type) {
      case 'message':
        await handleMessage(event);
        break;

      case 'app_mention':
        await handleAppMention(event);
        break;

      default:
        console.log(`Unhandled event type: ${type}`);
    }
  } catch (error) {
    console.error('Error processing Slack event:', error);
  }
}

// Handle incoming messages
async function handleMessage(event: any) {
  try {
    const { channel, text, user } = event;
    const targetChannel = process.env.SLACK_CHANNEL_ID;

    // Only process messages in the configured channel
    if (channel !== targetChannel) {
      console.log(`Message from different channel (${channel}), ignoring`);
      return;
    }

    console.log(`Processing message in channel ${channel}: ${text}`);

    // Add your content repurposing logic here
    // For example, you could:
    // - Analyze the message content
    // - Generate repurposed content
    // - Post to different channels or platforms

  } catch (error) {
    console.error('Error handling message:', error);
  }
}

// Handle app mentions
async function handleAppMention(event: any) {
  try {
    const { channel, text, user } = event;

    console.log(`App mentioned in channel ${channel} by user ${user}`);

    // Respond to the mention
    await slackClient.chat.postMessage({
      channel: channel,
      text: `Hi <@${user}>! I'm your content repurposing assistant. How can I help?`,
      thread_ts: event.ts
    });
  } catch (error) {
    console.error('Error handling app mention:', error);
  }
}

// Handle interactive components
async function handleSlackInteraction(payload: any) {
  try {
    const { type, user, channel } = payload;

    console.log(`Interaction received: ${type} from user ${user.id}`);

    // Handle different interaction types
    switch (type) {
      case 'block_actions':
        // Handle button clicks
        break;

      case 'view_submission':
        // Handle modal submissions
        break;

      default:
        console.log(`Unhandled interaction type: ${type}`);
    }
  } catch (error) {
    console.error('Error processing Slack interaction:', error);
  }
}

// Handle repurpose slash command
async function handleRepurposeCommand(text: string, channel: string, userId: string) {
  try {
    console.log(`Repurposing content: "${text}" for user ${userId}`);

    const targetChannel = process.env.SLACK_CHANNEL_ID;

    // Post a message to the configured channel
    await slackClient.chat.postMessage({
      channel: targetChannel || channel,
      text: `Content repurposing request from <@${userId}>:\n\n${text}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Content Repurposing Request*\n\nFrom: <@${userId}>\n\n${text}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Approve'
              },
              style: 'primary',
              action_id: 'approve_repurpose'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Decline'
              },
              style: 'danger',
              action_id: 'decline_repurpose'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error handling repurpose command:', error);
    throw error;
  }
}

// Test endpoint to post a message
app.post('/test/message', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const targetChannel = process.env.SLACK_CHANNEL_ID;

    if (!targetChannel) {
      return res.status(400).json({ error: 'SLACK_CHANNEL_ID not configured' });
    }

    const result = await slackClient.chat.postMessage({
      channel: targetChannel,
      text: message || 'Test message from Slack Automation!'
    });

    res.status(200).json({
      success: true,
      message: 'Message posted successfully',
      ts: result.ts
    });
  } catch (error: any) {
    console.error('Error posting test message:', error);
    res.status(500).json({
      error: 'Failed to post message',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Slack Events endpoint: http://localhost:${PORT}/slack/events`);
  console.log(`Slack Interactive endpoint: http://localhost:${PORT}/slack/interactive`);
  console.log(`Slack Commands endpoint: http://localhost:${PORT}/slack/commands`);

  // Validate required environment variables
  if (!process.env.SLACK_BOT_TOKEN) {
    console.warn('WARNING: SLACK_BOT_TOKEN not set');
  }
  if (!process.env.SLACK_CHANNEL_ID) {
    console.warn('WARNING: SLACK_CHANNEL_ID not set');
  }

  console.log(`Target Channel ID: ${process.env.SLACK_CHANNEL_ID || 'Not configured'}`);
});
