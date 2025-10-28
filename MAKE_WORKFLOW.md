# Make.com Content Repurposing Workflow Documentation

## Overview

This document describes the Make.com automation blueprint for the Content Repurposing Webhook system. The workflow integrates Slack, Notion, OpenAI, and Perplexity AI to automatically generate repurposed content based on user requests.

## Workflow Architecture

```
Slack Message
    ↓
Webhook Trigger (Module 15)
    ↓
Router (Module 18)
    ├── URL Verification → Respond with Challenge (Module 17)
    └── Event Callback
        ↓
    Duplicate Check (Module 32)
        ↓
    Router (Module 33)
        ├── Already Processed → Skip
        └── New Event
            ↓
        Store Event ID (Module 28)
            ↓
        Respond 200 OK (Module 19)
            ↓
        Filter: Normal Events (Module 13)
            ↓
        Fetch Notion Databases (Modules 13, 14)
            ↓
        Router (Module 4)
            ├── No Research Path
            │   ↓
            │   OpenAI GPT-4 (Module 2)
            │   ↓
            │   Post to Slack (Module 29)
            └── Research Path
                ↓
                Perplexity AI Research (Module 6)
                ↓
                OpenAI GPT-4 (Module 7)
                ↓
                Post to Slack (Module 30)
```

## Module Details

### 1. Webhook Trigger (Module 15)
- **Type**: Custom Webhook
- **Purpose**: Receives Slack Events API payloads
- **Configuration**:
  - Max Results: 5
  - Hook ID: 3391810
- **Output Fields**:
  - `token`: Slack verification token
  - `challenge`: URL verification challenge
  - `type`: Event type
  - `event`: Event payload (contains message data)

### 2. Main Router (Module 18)
Routes incoming events based on type:

#### Route 1: URL Verification
- **Filter**: `type === "url_verification"`
- **Action**: Respond with challenge (Module 17)
- **Response**:
  - Status: 200
  - Body: `{{15.challenge}}`
  - Headers: `Content-Type: text/plain`

#### Route 2: Event Processing
- **Filter**: Events that are NOT URL verification
- **Action**: Process the event through duplicate check and content generation

### 3. Duplicate Prevention (Module 32)
- **Type**: Datastore - Check Record Exists
- **Datastore**: "Slack Event Loop Prevention" (ID: 127058)
- **Key**: `{{15.event_id}}`
- **Filters** (ALL must match):
  1. `event.type === "event_callback"`
  2. `event.event.type === "message"`
  3. `authorizations[].is_bot` does NOT exist OR equals "false"
  4. `event.user !== "B09PJ8DT2HE"` (bot user ID)
  5. `event.user` is not empty

**Purpose**: Prevents processing the same Slack event multiple times

### 4. Event Storage Router (Module 33)

#### Route 1: Event Already Processed (Module 34)
- **Filter**: `exist === "true"`
- **Action**: Check existence again (loop prevention)

#### Route 2: New Event Processing
1. **Store Event ID** (Module 28)
   - Datastore: "Slack Event Loop Prevention"
   - Key: `{{15.event_id}}`
   - Data:
     - `event_id`: `{{15.event_id}}`
     - `timestamp`: `{{15.event.ts}}`
   - Overwrite: false

2. **Respond to Slack** (Module 19)
   - Status: 200
   - Body: Empty
   - Purpose: Acknowledge event within 3 seconds

3. **Fetch Notion Content Ideas** (Module 13)
   - Database ID: `9f4737db95b24102bbae5f80637ac8db`
   - Limit: 10
   - Sort: Created time (descending)
   - **Filters**:
     - Normal message events only
     - Not from bot users
     - User ID !== "U09JV1FUPMJ"

4. **Fetch Notion Content System** (Module 14)
   - Database ID: `bc632601-d5f6-455d-af66-ad040536bc3e`
   - Limit: 10
   - Purpose: Get existing content for context

### 5. Content Generation Router (Module 4)

#### Route 1: No Research Needed (Module 2)
**Filters** (Message does NOT contain any of):
- "research"
- "latest"
- "news"
- "trends"
- "current"

**OpenAI Configuration**:
- Model: `o4-mini`
- Temperature: 0.7
- Max Tokens: 2500
- Top P: 1

**System Prompt**: Cesar's Content Repurposing Assistant
- Transforms source material into platform-specific content
- Supports: Instagram, LinkedIn, YouTube, Email
- Voice: Conversational, knowledgeable, practical
- See detailed prompt in Module 2 mapper

**Post to Slack** (Module 29):
- Channel: `{{15.event.channel}}`
- Thread: `{{15.event.ts}}`
- Text: `{{2.choices[].message.content}}`
- Markdown: enabled

#### Route 2: Research Required (Module 6)
**Filters** (Message contains ANY of):
- "research"
- "latest"
- "news"
- "trends"
- "current"

**Perplexity AI Configuration** (Module 6):
- Model: `sonar`
- Temperature: 0.3
- Max Tokens: 2000
- Search Context Size: medium

**System Prompt**: Research assistant providing comprehensive, accurate information with citations

**OpenAI Configuration** (Module 7):
- Same configuration as Route 1
- Input: Original user message + Perplexity research results

**Post to Slack** (Module 30):
- Channel: `{{15.event.channel}}`
- Thread: `{{15.event.event_ts}}`
- Text: `{{7.choices[].message.content}}`
- Markdown: enabled

## Content Generation Rules

### Platform-Specific Guidelines

#### Instagram Posts
- First 125 characters = preview text (hook must be here)
- Length: 138-150 chars (short) OR 1,500-2,200 chars (long-form)
- Avoid 300-800 word middle zone
- Use 3-5 strategic hashtags
- 2-3 emojis strategically placed
- Line breaks every 2-3 sentences
- End with engagement question

#### Instagram Carousel
- 10x better engagement than single posts
- Slide 1: Hook/Problem
- Slides 2-8: Solutions/Steps (one per slide)
- Slides 9-10: Summary/CTA
- Text per slide: 15-30 words max

#### LinkedIn
- First 2-3 lines (210 chars) show before "see more"
- Optimal length: 1,300-2,000 characters
- Structure: Hook → Story → Insight → CTA
- Use 3-5 targeted hashtags
- Lists and numbered frameworks perform well
- Professional but personal tone

#### YouTube Scripts
- Hook in first 5-8 seconds
- Pattern interrupt every 60-90 seconds
- Script for speaking (contractions, casual)
- Include verbal chapter markers
- Structure:
  - [0:00-0:08] Hook
  - [0:08-0:30] Context/Story
  - [0:30-X:XX] Main content
  - [X:XX-End] Recap & CTA

#### Email Newsletters
- Subject: 40-50 characters, curiosity-driven
- Short paragraphs (2-3 sentences max)
- Length: 200-300 words (tips) OR 1,000-1,500 words (deep dive)
- ONE clear CTA
- P.S. section at end (high engagement)

### Cesar's Voice & Style
- Conversational but knowledgeable
- First person (I/we), never corporate third person
- Lead with bold statement or question
- Short sentences and paragraphs (max 2-3 lines)
- Line breaks between thoughts
- Clear call-to-action
- ONE main point per piece
- Practical, implementable advice

### Forbidden Elements
❌ Fitness clichés ("no pain no gain", "beast mode", "crush it", "grind")
❌ Generic motivational quotes without actionable advice
❌ Medical advice or diagnosis
❌ Hype or exaggeration
❌ Hyphens
❌ Format "This is not X - It's Y"

## Output Formats

### Single Post
```
---
POST 1:
[content]
---
```

### Multiple Posts
```
---
POST 1:
[content]
---
POST 2:
[content]
---
POST 3:
[content]
---
```

### Carousel
```
---
CAROUSEL: [Title]

SLIDE 1:
[Hook text - 15-30 words]

SLIDE 2:
[Point 1 - 15-30 words]

[continue for all slides]
---
```

## Environment Configuration

### Required Services
1. **Slack**
   - Bot Token
   - Webhook URL
   - Channel IDs

2. **Notion** (Connection ID: 8172248)
   - API Key
   - Database IDs:
     - Content Ideas: `9f4737db95b24102bbae5f80637ac8db`
     - Content System: `bc632601-d5f6-455d-af66-ad040536bc3e`

3. **OpenAI** (Connection ID: 6080736)
   - API Key
   - Model: o4-mini

4. **Perplexity AI** (Connection ID: 6080674)
   - API Key
   - Model: sonar

5. **Make.com Datastore**
   - Datastore ID: 127058
   - Name: "Slack Event Loop Prevention"

### Bot User IDs to Ignore
- `B09PJ8DT2HE` - Primary bot
- `U09JV1FUPMJ` - Secondary bot/user

## Event Flow Examples

### Example 1: Simple Content Request (No Research)
```
User in Slack: "Create 3 Instagram posts about sleep optimization"
    ↓
Webhook receives event
    ↓
Duplicate check (new event)
    ↓
Store event ID
    ↓
Fetch Notion databases
    ↓
Message doesn't contain research keywords
    ↓
OpenAI generates content (Route 1)
    ↓
Post 3 Instagram posts to Slack thread
```

### Example 2: Research-Based Content
```
User in Slack: "Research latest trends in intermittent fasting and create a LinkedIn post"
    ↓
Webhook receives event
    ↓
Duplicate check (new event)
    ↓
Store event ID
    ↓
Fetch Notion databases
    ↓
Message contains "research" and "latest"
    ↓
Perplexity AI researches intermittent fasting trends
    ↓
OpenAI generates LinkedIn post with research (Route 2)
    ↓
Post content to Slack thread
```

### Example 3: Duplicate Event (Prevented)
```
Slack retries event delivery (network issue)
    ↓
Webhook receives same event_id
    ↓
Duplicate check finds existing event_id
    ↓
Event processing stops (no duplicate work)
```

## Troubleshooting

### Events Not Processing
1. Check webhook is receiving events:
   - Verify Slack Events API subscription
   - Check webhook URL is accessible
   - Review Make.com webhook logs

2. Check filters:
   - Ensure message is not from bot user
   - Verify channel is correct
   - Check event structure matches filters

3. Check datastores:
   - Verify event IDs are being stored
   - Check for datastore capacity issues
   - Review datastore permissions

### Duplicate Messages
1. Event ID not being stored:
   - Check Module 28 execution
   - Verify datastore write permissions
   - Review event_id mapping

2. Multiple scenarios running:
   - Ensure only one scenario is active
   - Check for duplicate webhooks
   - Review scenario scheduling

### Content Not Generated
1. OpenAI issues:
   - Verify API key is valid
   - Check token limits
   - Review model availability

2. Perplexity issues:
   - Verify API key is valid
   - Check search quota
   - Review model configuration

3. Notion issues:
   - Verify database IDs are correct
   - Check API permissions
   - Review database structure

### Messages Not Posted to Slack
1. Check Slack permissions:
   - Verify bot token is valid
   - Check `chat:write` scope
   - Verify bot is in channel

2. Check thread_ts:
   - Ensure timestamp format is correct
   - Verify thread exists
   - Check channel ID matches

## Maintenance

### Regular Tasks
1. **Monitor datastore size**:
   - Event IDs accumulate over time
   - Consider implementing cleanup routine
   - Archive old events

2. **Review API usage**:
   - OpenAI token consumption
   - Perplexity search quota
   - Notion API rate limits

3. **Update system prompts**:
   - Refine content generation rules
   - Add new platform guidelines
   - Update voice/style preferences

4. **Test edge cases**:
   - Very long messages
   - Special characters
   - Multiple requests simultaneously

## Migration to Node.js

To implement this workflow in the existing Node.js server:

1. **Add dependencies**:
   ```bash
   npm install openai @notionhq/client
   ```

2. **Implement duplicate prevention**:
   - Use Redis or in-memory cache
   - Store event IDs with TTL

3. **Add Notion integration**:
   - Connect to databases
   - Fetch content for context

4. **Add OpenAI integration**:
   - Implement content generation
   - Add research path with Perplexity

5. **Enhance Slack responses**:
   - Post to threads
   - Format with markdown
   - Add error handling

See `IMPLEMENTATION.md` for detailed migration guide (to be created).

## Resources

- [Make.com Documentation](https://www.make.com/en/help/docs)
- [Slack Events API](https://api.slack.com/apis/connections/events-api)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Perplexity AI API](https://docs.perplexity.ai/)
- [Notion API](https://developers.notion.com/)

## Version History

- **v1.0** (Current): Initial Make.com automation blueprint
  - Webhook trigger
  - Duplicate prevention
  - Two-path content generation
  - Notion integration
  - Slack thread responses
