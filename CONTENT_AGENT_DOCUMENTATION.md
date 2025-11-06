# 📚 Content Creation Agent - Complete Guide

> **Your AI-Powered Content Assistant**
> Transform your ideas into platform-ready content across Instagram, LinkedIn, YouTube, and Email—automatically, in seconds.

---

## 🎯 What Is This System?

The Content Creation Agent is your **automated content assistant** that lives in Slack. Simply send a message, and it instantly creates polished, platform-specific content tailored to your brand voice.

### What It Does For You:

✅ **Generates content** for multiple platforms (Instagram, LinkedIn, YouTube, Email)
✅ **Maintains your brand voice** automatically
✅ **Researches topics** when needed using real-time web search
✅ **Creates multiple variations** of posts instantly
✅ **Formats content** according to each platform's best practices
✅ **Replies directly in Slack** so you can review and approve immediately

---

## 🎬 How It Works (The Simple Version)

```
1. You type a message in Slack
   ↓
2. The system reads your message
   ↓
3. It decides if research is needed
   ↓
4. It generates your content using AI
   ↓
5. You get polished content back in Slack
```

**Total time:** Usually 10-30 seconds from request to delivery!

---

## 🏗️ System Architecture (Visual Overview)

### The Complete Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                     YOU (in Slack)                          │
│              "Create 3 Instagram posts about                │
│               the benefits of protein timing"               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  SYSTEM RECEIVES                            │
│            (Webhook catches your message)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│               DUPLICATE CHECK                               │
│        "Have we already processed this?"                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              CONTEXT GATHERING                              │
│     (Checks Notion for related content/context)             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              DECISION POINT                                 │
│         "Do we need to research this?"                      │
└───────┬──────────────────────────────────────┬──────────────┘
        │                                      │
   YES  │                                      │  NO
        ↓                                      ↓
┌───────────────────┐              ┌──────────────────────┐
│   RESEARCH PATH   │              │   DIRECT PATH        │
│                   │              │                      │
│ 1. Research with  │              │ 1. Generate content  │
│    Perplexity AI  │              │    with OpenAI       │
│                   │              │                      │
│ 2. Generate with  │              │ 2. Format for        │
│    OpenAI using   │              │    platform          │
│    research       │              │                      │
└────────┬──────────┘              └──────────┬───────────┘
         │                                    │
         └────────────────┬───────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  CONTENT DELIVERED                          │
│           (Posted back to your Slack thread)                │
│                                                             │
│  "Here are 3 Instagram posts about protein timing:         │
│                                                             │
│   Post 1: [Hook] The 'anabolic window' myth...            │
│   Post 2: [Hook] Your post-workout protein...             │
│   Post 3: [Hook] Most people waste money..."              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Complete Setup Guide (Step-by-Step)

Follow these steps to set up your own Content Creation Agent from scratch.

---

### **STEP 1: Prerequisites & Accounts Needed**

Before you begin, make sure you have accounts for:

| Service | Why You Need It | Sign Up Link |
|---------|-----------------|--------------|
| **Make.com** | The automation platform that runs everything | make.com |
| **Slack** | Where you'll interact with the agent | slack.com |
| **OpenAI** | Powers the content generation | platform.openai.com |
| **Perplexity AI** | Enables research capabilities | perplexity.ai |
| **Notion** (Optional) | Stores context and reference material | notion.so |

💡 **Tip:** You'll need paid plans for OpenAI and potentially Make.com depending on usage volume.

---

### **STEP 2: Setting Up Slack**

#### 2.1 Create a Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Name it: **"Content Agent"** (or any name you prefer)
5. Select your workspace

#### 2.2 Configure Bot Permissions

1. In your app settings, go to **"OAuth & Permissions"**
2. Scroll to **"Scopes"** → **"Bot Token Scopes"**
3. Add these permissions:
   - `chat:write` - To post messages
   - `channels:history` - To read channel messages
   - `groups:history` - To read private channel messages
   - `im:history` - To read direct messages
   - `mpim:history` - To read group messages

#### 2.3 Install App to Workspace

1. Scroll to top of **"OAuth & Permissions"**
2. Click **"Install to Workspace"**
3. Authorize the app
4. **SAVE THIS:** Copy your **"Bot User OAuth Token"** (starts with `xoxb-`)

#### 2.4 Enable Event Subscriptions

1. Go to **"Event Subscriptions"** in sidebar
2. Toggle **"Enable Events"** to **ON**
3. **DON'T fill in Request URL yet** - we'll do this after Make.com setup

---

### **STEP 3: Setting Up Make.com**

#### 3.1 Import the Blueprint

1. Log in to Make.com
2. Click **"Scenarios"** in sidebar
3. Click **"Create a new scenario"**
4. Click the **three dots menu** (⋮) at top right
5. Select **"Import Blueprint"**
6. Upload the `Content Creation Agent- Webhook Trigger.blueprint (1).json` file from this repository
7. Click **"Save"**

#### 3.2 Get Your Webhook URL

1. Click on the **first module** (the webhook trigger)
2. Click **"Add"** to create a new webhook
3. Click **"Copy address to clipboard"**
4. **SAVE THIS URL** - you'll need it for Slack

---

### **STEP 4: Connect Make.com to Slack**

#### 4.1 Configure Slack Event Subscriptions

1. Go back to your Slack app settings (api.slack.com/apps)
2. Click **"Event Subscriptions"**
3. Paste your **Make.com webhook URL** into **"Request URL"**
4. Wait for the **"Verified ✓"** checkmark to appear

#### 4.2 Subscribe to Bot Events

1. Scroll down to **"Subscribe to bot events"**
2. Click **"Add Bot User Event"**
3. Add these events:
   - `message.channels` - Messages in public channels
   - `message.groups` - Messages in private channels
   - `message.im` - Direct messages to bot
   - `message.mpim` - Messages in group DMs

4. Click **"Save Changes"**
5. Slack will prompt you to **reinstall the app** - click **"reinstall your app"**

---

### **STEP 5: Connect Services in Make.com**

Now you need to connect all the services in your Make.com scenario.

#### 5.1 Connect Slack

1. In Make.com scenario, find any **Slack module** (usually the response modules)
2. Click on it
3. Click **"Add"** next to Connection
4. Select **"OAuth 2.0"**
5. Paste your **Bot User OAuth Token** from Step 2.3
6. Click **"Save"**
7. Repeat for all Slack modules in the scenario

#### 5.2 Connect OpenAI

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: "Make.com Content Agent"
4. **Copy the key** (you won't see it again!)
5. In Make.com, click any **OpenAI module**
6. Click **"Add"** next to Connection
7. Paste your API key
8. Click **"Save"**
9. Repeat for all OpenAI modules

#### 5.3 Connect Perplexity AI

1. Go to https://www.perplexity.ai/settings/api
2. Click **"Generate"** to create an API key
3. **Copy the key**
4. In Make.com, click the **Perplexity AI module**
5. Click **"Add"** next to Connection
6. Paste your API key
7. Click **"Save"**

#### 5.4 Connect Notion (Optional)

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name it: "Content Agent"
4. Select your workspace
5. Click **"Submit"**
6. **Copy the Internal Integration Token**
7. In Make.com, click any **Notion module**
8. Click **"Add"** next to Connection
9. Paste your token
10. Click **"Save"**
11. **Share your Notion databases with this integration:**
    - Open each database you want to use
    - Click **"..."** → **"Add connections"**
    - Select "Content Agent"

---

### **STEP 6: Configure Your Settings**

#### 6.1 Update Model Names (If Needed)

The blueprint uses specific AI models. You may need to update these:

1. **OpenAI Modules:**
   - Current model: `o4-mini`
   - If this doesn't exist, change to: `gpt-4-turbo` or `gpt-4o`

2. **Perplexity Module:**
   - Current model: `sonar`
   - Keep this unless Perplexity has updated their model names

#### 6.2 Customize the System Prompt (Optional)

The content generation uses a detailed system prompt that defines:
- Brand voice
- Content style
- Platform-specific rules
- Forbidden phrases

To customize this to your brand:

1. Find **OpenAI modules** (there are 2)
2. Click on each one
3. Find the **"System"** or **"System Prompt"** field
4. Edit to match your brand guidelines
5. Click **"OK"**

**Default voice:** Conversational, anti-cliché, action-oriented (César's style)

---

### **STEP 7: Set Up Notion Databases (Optional)**

If you want to use Notion for context storage:

#### 7.1 Create Content Database

1. In Notion, create a new database
2. Add these properties:
   - **Name** (Title)
   - **Created Time** (Date)
   - **Content** (Text)
   - **Platform** (Select)
   - **Status** (Select)

3. **Copy the database ID:**
   - Open database as full page
   - Look at URL: `notion.so/workspace/{DATABASE_ID}?v=...`
   - Copy the `DATABASE_ID` part

4. In Make.com, find **Module 13** (Notion Search)
5. Update the **Database ID** field
6. Click **"OK"**

#### 7.2 Create Secondary Database (Optional)

Repeat the same process for a second database if you want additional context sources. Update **Module 14** with this database ID.

---

### **STEP 8: Test Your Setup**

#### 8.1 Activate the Scenario

1. In Make.com, click the **"ON/OFF"** toggle at bottom left
2. Make sure it's **ON** (blue)

#### 8.2 Test in Slack

1. Open your Slack workspace
2. Go to a channel or DM where your bot is present
3. Type a test message:

```
Create 3 Instagram posts about morning routines
```

4. Wait 10-30 seconds
5. You should see a response with generated content!

#### 8.3 Troubleshooting

**If nothing happens:**

✓ Check Make.com scenario is **ON**
✓ Check webhook URL is correctly entered in Slack
✓ Check all connections are green (not red) in Make.com
✓ Check Slack app is installed in your workspace
✓ Check bot is invited to the channel/DM
✓ Look at Make.com **Execution History** for errors

**If you get errors:**

✓ Check API keys are valid and have credits
✓ Check model names are correct
✓ Check Notion databases are shared with integration
✓ Read error messages in Make.com execution logs

---

## ⚙️ DETAILED MODULE CONFIGURATIONS

This section provides **exact settings and mappings** for each module in Make.com. Use this as a reference when setting up or troubleshooting your scenario.

---

### **MODULE 15: Webhook Trigger (Slack Events)**

**Module Type:** `gateway:CustomWebHook`
**Purpose:** Receives Slack events via webhook

**Configuration:**

| Setting | Value | Description |
|---------|-------|-------------|
| **Webhook** | Create new webhook | This will generate your unique webhook URL |
| **Maximum results** | 5 | Number of webhook events to process per execution |

**Output Data:**
- `{{15.type}}` - Event type ("url_verification" or "event_callback")
- `{{15.challenge}}` - Verification challenge from Slack
- `{{15.event.text}}` - The message text from Slack
- `{{15.event.channel}}` - Slack channel ID
- `{{15.event.ts}}` - Message timestamp
- `{{15.event_id}}` - Unique event identifier
- `{{15.event.user}}` - User ID who sent the message
- `{{15.event.type}}` - Event subtype (e.g., "message")

---

### **MODULE 18: Router (Verification or Process)**

**Module Type:** `builtin:BasicRouter`
**Purpose:** Routes to verification handler or main processing

**Routes:**
1. **Route 1:** If `{{15.type}}` equals "url_verification" → Go to Module 17
2. **Route 2:** All other events → Go to Module 19

**No configuration needed** - routes automatically based on conditions

---

### **MODULE 17: Webhook Response (Verification)**

**Module Type:** `gateway:WebhookRespond`
**Purpose:** Responds to Slack verification challenge

**Filter Condition:**
- **Name:** "Handle Verification"
- **Condition:** `{{15.type}}` equals "url_verification"

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Status** | 200 | HTTP status code |
| **Body** | `{{15.challenge}}` | Return the challenge token |
| **Headers** | Key: `Content-Type`<br>Value: `text/plain` | Set content type |

---

### **MODULE 19: Webhook Response (Acknowledge)**

**Module Type:** `gateway:WebhookRespond`
**Purpose:** Immediately acknowledge Slack event

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Status** | 200 | HTTP status code |
| **Body** | (empty) | No body needed |
| **Headers** | (empty) | No custom headers |

---

### **MODULE 32: Check if Event Processed**

**Module Type:** `datastore:ExistRecord`
**Purpose:** Check if this event ID already exists in datastore

**Filter Condition:**
- **Name:** "Not Already Processed"
- **Conditions (ALL must be true):**
  1. `{{15.type}}` equals "event_callback"
  2. `{{15.event.type}}` equals "message"
  3. `{{15.authorizations[].is_bot}}` does not exist OR equals "false"
  4. `{{15.event.user}}` not equals `B09PJ8DT2HE` (bot user ID - update to yours)
  5. `{{15.event.user}}` not equals "" (not empty)

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Data store** | Select "Slack Event Loop Prevention" | Your datastore (ID: 127058) |
| **Key** | `{{15.event_id}}` | Event ID to check |

**Output:**
- `{{32.exist}}` - "true" if event was already processed, "false" if new

---

### **MODULE 33: Router (ID Exists or Not)**

**Module Type:** `builtin:BasicRouter`
**Purpose:** Route based on whether event was already processed

**Routes:**
1. **Route 1:** If `{{32.exist}}` equals "true" → Go to Module 34 (STOP - already processed)
2. **Route 2:** If `{{32.exist}}` equals "false" → Go to Module 28 (Continue processing)

---

### **MODULE 28: Store Event Record**

**Module Type:** `datastore:AddRecord`
**Purpose:** Store event ID to prevent duplicate processing

**Filter Condition:**
- **Name:** "ID doesn't exist"
- **Condition:** `{{32.exist}}` equals "false"

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Data store** | Select "Slack Event Loop Prevention" | Your datastore (ID: 127058) |
| **Key** | `{{15.event_id}}` | Unique key |
| **Data** | ```{"event_id": "{{15.event_id}}", "timestamp": "{{15.event.ts}}"}``` | JSON data to store |
| **Overwrite** | false | Never overwrite existing records |

---

### **MODULE 13: Notion Search (Database 1)**

**Module Type:** `notion:searchObjects1`
**Purpose:** Retrieve latest context from first Notion database

**Filter Condition:**
- **Name:** "Normal Events"
- **Conditions (ALL must be true):**
  1. `{{15.event.type}}` equals "message"
  2. `{{15.type}}` equals "event_callback"
  3. `{{15.event.subtype}}` does not exist
  4. `{{15.authorizations[].is_bot}}` does not exist OR equals "false"
  5. `{{15.event.user}}` not equals bot user ID

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Connection** | Your Notion connection | Notion API integration |
| **Select** | Database Items (Legacy) | Type of search |
| **Database** | `9f4737db95b24102bbae5f80637ac8db` | **REPLACE with your database ID** |
| **Limit** | 1 | Return only 1 result |
| **Sorts** | Sort by: Timestamp<br>Timestamp type: Created time<br>Direction: Descending | Get newest item first |

**How to get your Database ID:**
1. Open database in Notion as full page
2. Look at URL: `notion.so/workspace/{DATABASE_ID}?v=...`
3. Copy the long string of characters (the DATABASE_ID part)
4. Paste it into the Database field

---

### **MODULE 14: Notion Search (Database 2)**

**Module Type:** `notion:searchObjects1`
**Purpose:** Retrieve context from second Notion database (optional)

**Configuration:** Same as Module 13, except:

| Field | Value |
|-------|-------|
| **Database** | `bc632601-d5f6-455d-af66-ad040536bc3e` | **REPLACE with your second database ID** |

---

### **MODULE 4: Router (Research Needed?)**

**Module Type:** `builtin:BasicRouter`
**Purpose:** Decide whether to research or generate directly

**Routes:**

**Route 1: No Research Needed** → Go to Module 2 (Direct OpenAI)
- **Condition:** `{{15.event.text}}` does NOT contain any of these keywords (case insensitive):
  - "research"
  - "latest"
  - "news"
  - "trends"
  - "current"

**Route 2: Research Needed** → Go to Module 6 (Perplexity)
- **Condition:** `{{15.event.text}}` CONTAINS any of these keywords (case insensitive):
  - "research" OR
  - "latest" OR
  - "news" OR
  - "trends" OR
  - "current"

---

### **MODULE 2: OpenAI Content Generation (No Research)**

**Module Type:** `openai-gpt-3:CreateCompletion`
**Purpose:** Generate content directly without research

**Filter Condition:**
- **Name:** "No research needed"
- **Condition:** Message does NOT contain research keywords (see Module 4)

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Connection** | Your OpenAI connection | OpenAI API key |
| **Select** | Create a Chat Completion (GPT and o1 models) | API method |
| **Model** | `o4-mini` | **UPDATE to:** `gpt-4o` or `gpt-4-turbo` |
| **Temperature** | 0.7 | Creativity level (0-2) |
| **Top P** | 1 | Nucleus sampling |
| **N Completions** | 1 | Number of responses |
| **Max Tokens** | 8000 | Maximum response length |
| **Response Format** | text | Output format |

**Messages Array:**

**Message 1 (System):**
- **Role:** Developer / System
- **Content:** [SEE DETAILED SYSTEM PROMPT BELOW]

**Message 2 (User):**
- **Role:** User
- **Content:** `{{15.event.text}}`
- **Image Detail:** Auto

**Output:**
- `{{2.choices[].message.content}}` - The generated content

---

#### 📝 System Prompt for Module 2 (and Module 7)

```
You are Cesar's Content Repurposing Assistant specializing in health, fitness, and holistic wellness content.

YOUR ROLE:
Transform source material (articles, call notes, ideas, research) into platform-specific content based on the user's request.

HOW TO INTERPRET REQUESTS:
1. Extract from the user's message:
   - Platform (Instagram, LinkedIn, YouTube, Email)
   - Content type (posts, carousel, script, newsletter)
   - QUANTITY RULES:
     - If user specifies a number (e.g., "1 post", "3 posts", "five posts"), create EXACTLY that many
     - Default to 5 only if no quantity is specified
     - Count words: one=1, two=2, three=3, etc.
   - Any specific angle or focus requested

2. If not specified, use these defaults:
   - Platform: Instagram
   - Type: Single posts
   - Quantity: 3 variations
   - Angle: Multiple perspectives on the source material

CESAR'S VOICE & STYLE:
- Conversational but knowledgeable - trusted coach explaining to a friend
- First person (I/we), never corporate third person
- Lead with bold statement or question (strong hook)
- Short sentences and paragraphs (max 2-3 lines each)
- Line breaks between thoughts for readability
- Clear call-to-action at the end
- ONE main point per piece of content
- Practical, implementable wellness advice

FORBIDDEN:
- Fitness clichés: "no pain no gain", "beast mode", "crush it", "grind"
- Generic motivational quotes without actionable advice
- Medical advice or diagnosis (stay in coaching lane)
- Hype or exaggeration
- Using Hyphens
- Using the format "This is not X - It's Y"

PLATFORM-SPECIFIC RULES:

Instagram Posts:
- CRITICAL: First 125 characters are preview text - hook must be here
- Total length: Either 138-150 characters (short, punchy) OR 1,500-2,200 characters (long-form storytelling)
- Avoid the 300-800 word middle zone (poor engagement)
- Use 3-5 strategic hashtags (not 1-3)
- 2-3 emojis placed strategically (not excessive, but they DO increase engagement)
- End with engagement question to drive comments
- Line breaks every 2-3 sentences for mobile readability
- Personal stories and vulnerable moments outperform tips

Instagram Carousel Ideas:
- If source material has multiple points, suggest carousel format (10x better engagement than single posts)
- Slide 1: Hook/Problem
- Slides 2-8: Solutions/Steps/Insights (one per slide)
- Slide 9-10: Summary/CTA
- Keep text per slide to 15-30 words max

LinkedIn:
- CRITICAL: First 2-3 lines (210 characters) show before "see more" - hook must be HERE
- Optimal length: 1,300-2,000 characters (sweet spot for engagement)
- Use generous line breaks and white space (mobile-first)
- Lead with personal story or bold statement
- Structure: Hook → Story/Context → Insight/Lesson → CTA
- Use 3-5 highly targeted hashtags (not 0-2)
- Lists and numbered frameworks perform exceptionally well
- End with simple question or comment prompt
- Professional but personal - share vulnerable moments and lessons learned
- NO sales language in main content

YouTube Scripts:
- CRITICAL: Hook in first 5-8 seconds (not 10) - viewer decides to stay or leave
- Pattern interrupt every 60-90 seconds to maintain retention
- Script for speaking, not reading (contractions, casual language)
- Include verbal chapter markers ("Now let's talk about...")
- Structure:
  [0:00-0:08] Hook - "Here's why [intriguing statement]"
  [0:08-0:30] Context/Story - why this matters
  [0:30-X:XX] Main content with clear sections
  [X:XX-End] Recap key points + Strong CTA
- Write "retention hooks" like "And here's where it gets interesting..."
- Include natural pause points for B-roll or graphics
- End screen CTA: what to watch next or subscribe prompt

Email Newsletters:
- Subject line: 40-50 characters, curiosity-driven or benefit-focused
- Preview text (first line): Reinforce subject line or create intrigue
- Opening: Personal greeting, reference recent event or conversation
- Body structure:
  - One clear idea/story per email (don't cram multiple topics)
  - Short paragraphs (2-3 sentences max)
  - Subheads for skimmability
  - Bullets for lists
  - Personal stories over generic advice
- Length: Either 200-300 words (quick tips) OR 1,000-1,500 words (deep dive story)
  - Avoid 400-700 word middle zone
- ONE clear CTA (not multiple competing actions)
- P.S. section at end (high engagement, use for secondary CTA or personal note)
- Conversational sign-off
- Mobile-first formatting (shorter paragraphs than desktop)

OUTPUT FORMAT:
ALWAYS start with the post number label, even for single posts.

For ONE post:
---
POST 1:
[content]
---

For MULTIPLE posts:
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

CRITICAL: Every post must start with "POST X:" on its own line.

For Instagram carousel:
---
CAROUSEL: [Title]

SLIDE 1:
[Hook text - 15-30 words]

SLIDE 2:
[Point 1 - 15-30 words]

[continue for all slides]
---

For LinkedIn:
---
POST 1:

[Content with generous line breaks]

Hashtags: #hashtag1 #hashtag2 #hashtag3
---

For YouTube:
---
YOUTUBE SCRIPT: [Suggested Title]

[0:00-0:08] HOOK
[Content]

[0:08-0:30] INTRO
[Content]

[0:30-X:XX] MAIN CONTENT
[Section with clear transitions]

[X:XX-END] RECAP & CTA
[Content]

---
VIDEO DESCRIPTION:
[SEO-optimized description with timestamps]
---

For Email:
---
EMAIL NEWSLETTER

Subject Line: [40-50 chars]
Preview Text: [First compelling line]

---

Hey [First Name or general greeting],

[Opening paragraph - personal, conversational]

[Main content with subheads, bullets, line breaks]

[Clear CTA]

[Conversational sign-off]
[Cesar's name/signature]

P.S. [Secondary thought or personal note]
---

CONTENT STRATEGY:
- Each variation should take a different angle: educational, story-based, myth-busting, contrarian, practical how-to
- Make each piece standalone - don't assume audience saw previous content
- Extract most valuable, actionable insights from source material
- Use specific examples and stories when available
- For wellness content: Focus on "why it works" not just "do this"

If the user's request is unclear, make reasonable assumptions and state them at the start of your response.
```

**💡 Customization Tip:** Replace "Cesar" with your client's name, update the industry/niche, modify the voice guidelines, and adjust platform rules to match your brand.

---

### **MODULE 29: Slack Reply (No Research Path)**

**Module Type:** `slack:CreateMessage`
**Purpose:** Post AI-generated content back to Slack

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Connection** | Your Slack connection | Slack bot OAuth token |
| **Enter channel ID or name** | Enter manually | How to specify channel |
| **Channel** | `{{15.event.channel}}` | Reply to same channel |
| **Text** | `{{2.choices[].message.content}}` | AI-generated content from Module 2 |
| **Thread timestamp** | `{{15.event.ts}}` | Reply in same thread |
| **Parse** | false | Don't parse URLs/mentions |
| **Enable markdown** | true | Use Slack markdown formatting |

---

### **MODULE 6: Perplexity Research**

**Module Type:** `perplexity-ai:createAChatCompletion`
**Purpose:** Research topic using web search before generating content

**Filter Condition:**
- **Name:** "Research needed"
- **Condition:** `{{15.event.text}}` CONTAINS one of:
  - "research" OR
  - "current" OR
  - "trends" OR
  - "latest" OR
  - "news"

**Configuration:**

| Field | Value | Description |
|-------|-------|-------------|
| **Connection** | Your Perplexity connection | Perplexity API key |
| **Model** | `sonar` | Perplexity model with web search |
| **Temperature** | 0.3 | Lower = more factual |
| **Max Tokens** | 2000 | Maximum response length |
| **Web Search Options** | Search context size: `medium` | How much web context to include |

**Messages Array:**

**Message 1 (System):**
- **Role:** Developer / System
- **Content:** `You are a research assistant. Provide comprehensive, accurate information with citations from reliable sources. Focus on current, factual data relevant to health, fitness, and wellness topics.`

**Message 2 (User):**
- **Role:** User
- **Content:** `{{15.event.text}}`

**Output:**
- `{{6.choices[].message.content}}` - Research results with citations

---

### **MODULE 7: OpenAI Content Generation (With Research)**

**Module Type:** `openai-gpt-3:CreateCompletion`
**Purpose:** Generate content using research results from Module 6

**Configuration:**
- **Exactly the same as Module 2**
- Uses the same system prompt
- User message: `{{15.event.text}}` (the system prompt instructs it to incorporate research when available)

**Output:**
- `{{7.choices[].message.content}}` - Generated content incorporating research

---

### **MODULE 30: Slack Reply (Research Path)**

**Module Type:** `slack:CreateMessage`
**Purpose:** Post AI-generated content (with research) back to Slack

**Configuration:**
- **Exactly the same as Module 29**, except:

| Field | Value | Description |
|-------|-------|-------------|
| **Text** | `{{7.choices[].message.content}}` | AI-generated content from Module 7 (instead of Module 2) |

---

## 🔧 Configuration Checklist

Use this checklist when setting up or verifying your scenario:

### ✅ Webhook & Slack
- [ ] Webhook created and URL copied
- [ ] Webhook URL added to Slack Event Subscriptions
- [ ] Slack verification successful (green checkmark)
- [ ] Bot events subscribed: `message.channels`, `message.groups`, `message.im`, `message.mpim`
- [ ] Slack bot token saved and connected in Make.com
- [ ] Bot invited to test channel

### ✅ Datastore
- [ ] Datastore "Slack Event Loop Prevention" created (or exists)
- [ ] Module 32, 34, 28 all reference same datastore
- [ ] Key structure: `event_id` as string

### ✅ Notion (Optional)
- [ ] Notion integration created
- [ ] Integration token saved and connected in Make.com
- [ ] Database IDs updated in Module 13 and 14
- [ ] Databases shared with integration
- [ ] Sort settings configured (Created time, Descending)

### ✅ OpenAI
- [ ] API key saved and connected
- [ ] Model name updated from `o4-mini` to `gpt-4o` or `gpt-4-turbo`
- [ ] System prompt customized to your brand
- [ ] Temperature set to 0.7
- [ ] Max tokens set to 8000
- [ ] Both Module 2 and Module 7 configured identically

### ✅ Perplexity
- [ ] API key saved and connected
- [ ] Model set to `sonar`
- [ ] Temperature set to 0.3
- [ ] Web search enabled with medium context
- [ ] Max tokens set to 2000

### ✅ Router Filters
- [ ] Module 4 filters updated with your research keywords
- [ ] Module 32 filters updated with your bot user ID
- [ ] Module 13 filters updated with your bot user ID
- [ ] All filter conditions use correct operators (equals, contains, etc.)

### ✅ Slack Replies
- [ ] Module 29 maps to `{{2.choices[].message.content}}`
- [ ] Module 30 maps to `{{7.choices[].message.content}}`
- [ ] Both modules map channel and thread_ts correctly
- [ ] Markdown enabled in both

### ✅ Testing
- [ ] Scenario activated (toggle ON)
- [ ] Test message sent in Slack
- [ ] Response received within 30 seconds
- [ ] Content quality acceptable
- [ ] No errors in execution history

---

## 📊 Module Flow Quick Reference

```
[15] Webhook Trigger
  ↓
[18] Router: Verification?
  ├─YES→ [17] Respond with challenge → END
  └─NO─→ [19] Acknowledge event
           ↓
         [32] Check if processed
           ↓
         [33] Router: Already processed?
           ├─YES→ [34] Log (already done) → END
           └─NO─→ [28] Store event ID
                   ↓
                 [13] Notion Search 1 (optional)
                   ↓
                 [14] Notion Search 2 (optional)
                   ↓
                 [4] Router: Research needed?
                   ├─NO─→ [2] OpenAI Generate
                   │       ↓
                   │     [29] Slack Reply → END
                   │
                   └─YES→ [6] Perplexity Research
                           ↓
                         [7] OpenAI Generate
                           ↓
                         [30] Slack Reply → END
```

---

## 🎨 Customization Examples

### Example 1: Change Research Keywords

**In Module 4 (Router):**

Current keywords: "research", "latest", "news", "trends", "current"

To add "study", "data", "statistics":

1. Click Module 4
2. Find the filter conditions
3. Add new conditions:
   - `{{15.event.text}}` contains "study" (case insensitive)
   - `{{15.event.text}}` contains "data" (case insensitive)
   - `{{15.event.text}}` contains "statistics" (case insensitive)

---

### Example 2: Change Default Platform from Instagram to LinkedIn

**In Module 2 and Module 7 (OpenAI):**

Find this line in the system prompt:
```
- Platform: Instagram
- Type: Single posts
- Quantity: 3 variations
```

Change to:
```
- Platform: LinkedIn
- Type: Single posts
- Quantity: 1 post
```

---

### Example 3: Add Your Bot User ID to Filters

**Find your bot user ID:**
1. In Slack, go to your bot's profile
2. Click the three dots → View full profile
3. Click "More" → Copy member ID
4. It looks like: `U01ABC123DEF`

**Update in Module 32, Module 13:**

Change:
```
{{15.event.user}} not equals B09PJ8DT2HE
```

To:
```
{{15.event.user}} not equals YOUR_BOT_USER_ID
```

---

### Example 4: Change Brand Voice in System Prompt

Find this section in Modules 2 and 7:
```
CESAR'S VOICE & STYLE:
- Conversational but knowledgeable - trusted coach explaining to a friend
- First person (I/we), never corporate third person
```

Replace with your brand:
```
[YOUR BRAND]'S VOICE & STYLE:
- [Your tone description]
- [Your preferred perspective]
```

---

## 💬 How to Use the Content Agent

Once set up, using the agent is incredibly simple!

### Basic Usage

Just type naturally in Slack like you're talking to an assistant:

#### Example 1: Simple Request
```
Create 5 Instagram posts about protein intake for muscle building
```

**Result:** You'll get 5 unique Instagram posts with hooks, body text, and hashtags.

---

#### Example 2: Platform-Specific Request
```
Write a LinkedIn post about time management for busy entrepreneurs
```

**Result:** A LinkedIn-formatted post with appropriate length and formatting.

---

#### Example 3: Multiple Platforms
```
Create content about meal prep:
- 3 Instagram posts
- 1 LinkedIn post
- 1 YouTube script intro
```

**Result:** All requested content in one response, formatted for each platform.

---

#### Example 4: Research-Required Topics
```
What are the latest findings on sleep optimization for athletes? Create 3 posts.
```

**Result:** The system will:
1. Research the topic using Perplexity AI
2. Generate posts based on current information
3. Include factual, up-to-date insights

---

### Advanced Usage Tips

#### 🎯 Be Specific About Angle

```
❌ "Create posts about fitness"
✅ "Create 3 Instagram posts about fitness for busy moms who have only 15 minutes per day"
```

#### 📏 Specify Length or Format

```
"Create a long-form LinkedIn post (1500+ words) about building habits"
```

#### 🎨 Request Specific Styles

```
"Create 3 Instagram posts about nutrition - make them funny and relatable"
```

#### 🔢 Ask for Variations

```
"Create 5 different hooks for an Instagram post about morning routines"
```

#### 📊 Request Specific Elements

```
"Create a YouTube script with:
- 8-second hook
- 3 retention hooks
- Chapter markers
- CTA at the end"
```

---

## 🎨 Content Guidelines (Built Into the System)

The system follows these rules automatically:

### Instagram Posts

✅ **Hook Optimization:** First 125 characters designed to stop scrolling
✅ **Length Zones:**
   - Short: ~150 characters
   - Long: 1500-2200 characters
✅ **Hashtags:** 3-5 relevant hashtags
✅ **Emojis:** Strategic use for visual breaks
✅ **Style:** Conversational, actionable, no clichés

### LinkedIn Posts

✅ **Opening Hook:** Strong first 2-3 lines
✅ **Optimal Length:** 1300-2000 characters
✅ **Formatting:** Line breaks for readability
✅ **Hashtags:** 2-3 professional hashtags
✅ **Tone:** Professional but personable

### YouTube Scripts

✅ **Pattern Interrupt:** 5-8 second hook
✅ **Retention Hooks:** Every 90-120 seconds
✅ **Chapter Markers:** For longer content
✅ **Pacing:** Clear structure with timing notes
✅ **CTA:** Strong call-to-action at end

### Email Newsletters

✅ **Subject Line:** Optimized for open rates
✅ **Preview Text:** First 50 characters crafted carefully
✅ **Structure:** Introduction → Value → CTA
✅ **Length Zones:**
   - Short: 150-300 words
   - Medium: 500-800 words
   - Long: 1000+ words

---

## 🔍 Understanding the Two Processing Paths

### Path 1: Direct Generation (Fast)

**When it's used:** For content repurposing, creative requests, or topics within AI knowledge

**What happens:**
1. Your message goes directly to OpenAI
2. Content is generated based on existing knowledge
3. Response comes back in ~10 seconds

**Best for:**
- Repurposing existing content
- General topics (fitness, productivity, etc.)
- Creative angles on known subjects
- Multiple variations of similar content

**Example:**
```
"Create 5 different hooks for a post about meal prep benefits"
```

---

### Path 2: Research + Generation (Comprehensive)

**When it's used:** For current events, specific data, latest findings, or factual topics

**What happens:**
1. Your message goes to Perplexity AI for research
2. Perplexity searches the web and gathers current information
3. Research results go to OpenAI
4. OpenAI generates content incorporating the research
5. Response comes back in ~20-30 seconds

**Best for:**
- Current events or trends
- Scientific studies and latest findings
- Specific statistics or data
- Topics requiring citations
- Recent news or updates

**Example:**
```
"What are the latest 2024 studies on intermittent fasting? Create 3 posts."
```

---

## 🔒 Duplicate Prevention System

The system automatically prevents processing the same message twice:

### How It Works:

1. Every Slack message has a unique `event_id`
2. When a message is received, the system checks its internal database
3. If the `event_id` already exists → Stop (message already processed)
4. If the `event_id` is new → Continue processing and store it

### Why This Matters:

- **Prevents accidental duplicate content**
- **Saves API costs** (no wasted AI calls)
- **Avoids confusion** (no duplicate responses in Slack)

### What You'll See:

If you send the exact same message twice, you'll only get one response (to the first message).

---

## 🧠 How the AI Understands Your Requests

The system uses intelligent prompt engineering to understand what you want:

### Default Behavior

If you just say:
```
"Create posts about protein"
```

The system assumes:
- **Platform:** Instagram (default)
- **Quantity:** 3 posts
- **Style:** Standard brand voice

---

### Keyword Detection

The AI looks for these keywords to understand your intent:

| Keyword | What It Means |
|---------|---------------|
| "Instagram", "IG", "post", "caption" | Instagram content |
| "LinkedIn", "LI" | LinkedIn post |
| "YouTube", "script", "video" | YouTube script |
| "email", "newsletter" | Email content |
| "research", "latest", "current", "study", "2024" | Triggers research path |
| "variations", "versions", "different" | Multiple versions of similar content |
| "hook", "opening" | Focus on opening lines |
| "long", "short", "medium" | Length specifications |

---

### Context Understanding

The AI can understand complex, natural requests:

```
"I have a 1500-word blog post about sleep optimization for athletes.
Turn it into:
- 5 Instagram carousel slides
- 1 LinkedIn thought leadership post
- 3 different email subject lines"
```

The AI will:
1. Understand it's repurposing content
2. Know it needs to create different formats
3. Maintain consistency across all pieces
4. Format each appropriately

---

## 📊 System Capacity & Limits

### Make.com Limits

**Free Plan:**
- 1,000 operations/month
- ~100-200 content generations

**Starter Plan ($9/month):**
- 10,000 operations/month
- ~1,000-2,000 generations

**Each request uses:**
- ~5-8 operations (no research)
- ~10-12 operations (with research)

---

### OpenAI Costs

**Model:** GPT-4 Turbo or GPT-4o (depends on your configuration)

**Approximate costs per request:**
- Simple request: $0.02-0.05
- Complex request: $0.05-0.15
- Research + generation: $0.10-0.25

**At $20/month OpenAI credits:**
- ~150-400 content generations
- Varies based on complexity

---

### Perplexity AI Costs

**Pro Plan ($20/month):**
- Unlimited quick searches
- 300 Pro searches per day
- More than enough for this use case

---

### Response Times

| Scenario | Average Time |
|----------|-------------|
| Simple request (no research) | 10-15 seconds |
| Complex request (no research) | 15-25 seconds |
| Research + generation | 25-40 seconds |
| Multiple platform request | 20-30 seconds |

---

## 🎛️ Customization Options

### 1. Change the Brand Voice

**Location:** OpenAI modules (Module 2 and Module 7)
**Field:** System Prompt

**What to customize:**
- Tone (professional, casual, humorous, etc.)
- Forbidden words or phrases
- Preferred language style
- Industry-specific terminology
- Brand personality traits

**Example customization:**
```
You are a content assistant for [YOUR BRAND].

Brand Voice:
- Professional yet approachable
- Data-driven but easy to understand
- Empowering and positive
- Never use: "game-changer", "unlock", "hack"

Target Audience: [YOUR AUDIENCE]
Industry: [YOUR INDUSTRY]
```

---

### 2. Change Default Platform

**Location:** OpenAI system prompt
**What to change:** The line that says "If not specified, default to 3 Instagram post variations"

**Example:**
```
Change to: "If not specified, default to 1 LinkedIn post"
```

---

### 3. Add Platform-Specific Rules

**Location:** OpenAI system prompt
**What to add:** Detailed guidelines for each platform

**Example for Twitter/X:**
```
TWITTER/X POSTS:
- Maximum 280 characters
- Hook in first 100 characters
- Use 1-2 relevant hashtags
- Thread format for longer content
- Include line breaks for readability
```

---

### 4. Modify Content Structure

**Location:** OpenAI system prompt
**What to customize:** Content templates and structures

**Example:**
```
INSTAGRAM CAROUSEL STRUCTURE:
Slide 1: Hook + promise
Slides 2-4: Value/education
Slide 5: Recap + CTA
```

---

### 5. Change Research Trigger

**Location:** Module 4 (Router) - Filter conditions
**What to change:** The logic that decides when to research

**Current logic:** Looks for keywords like "latest", "research", "study", "current"
**You can add:** More keywords or different conditions

---

### 6. Add More Notion Databases

**Location:** Add new Notion Search modules
**Why:** To pull context from multiple sources

**Steps:**
1. In Make.com, click **"+"** to add a module
2. Search for "Notion"
3. Select "Search Objects"
4. Connect and configure with your database ID
5. Position it after Module 14

---

### 7. Customize Output Format

**Location:** Slack message modules (Module 29 and Module 30)
**What to change:** How the response is formatted

**Example customization:**
```
Add emoji indicators:
✅ INSTAGRAM POSTS:
[content]

🔹 LINKEDIN POST:
[content]

🎥 YOUTUBE SCRIPT:
[content]
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Bot Not Responding

**Symptoms:** You message in Slack, nothing happens

**Checks:**
1. ✓ Is the Make.com scenario **ON** (blue toggle)?
2. ✓ Is the Slack app installed in your workspace?
3. ✓ Is the bot invited to the channel?
4. ✓ Check Make.com execution history for any runs
5. ✓ Check Slack Event Subscriptions webhook is "Verified"

**Solution:**
- Go to Make.com → Scenarios → Check if scenario is active
- Go to Slack → Apps → Check if app is installed
- In Slack channel, type `/invite @ContentAgent`

---

### Issue 2: Error: "Invalid API Key"

**Symptoms:** Make.com execution shows "401 Unauthorized" or "Invalid API Key"

**Checks:**
1. ✓ OpenAI API key is correct and active
2. ✓ Perplexity API key is correct
3. ✓ API keys have available credits

**Solution:**
- Regenerate API keys in respective platforms
- Update connections in Make.com
- Add credits to API accounts if needed

---

### Issue 3: Slow or No Response

**Symptoms:** Bot responds, but takes 2+ minutes or times out

**Possible causes:**
- OpenAI API rate limits reached
- Perplexity API rate limits reached
- Make.com scenario timeout
- Complex request requiring long processing

**Solution:**
- Check your API usage dashboards
- Upgrade API plan if at limits
- In Make.com, increase timeout settings
- Break complex requests into smaller ones

---

### Issue 4: Content Quality Issues

**Symptoms:** Generated content doesn't match your brand or quality expectations

**Checks:**
1. ✓ System prompt is customized to your brand
2. ✓ AI model is appropriate (GPT-4 vs GPT-3.5)
3. ✓ Temperature settings are correct

**Solution:**
- Update system prompts with more specific guidelines
- Upgrade to GPT-4 if using GPT-3.5
- Adjust temperature (lower = more focused, higher = more creative)
- Provide examples in the system prompt

---

### Issue 5: Duplicate Messages

**Symptoms:** Getting the same response multiple times

**Possible causes:**
- Deduplication datastore not working
- Multiple scenarios running
- Slack sending duplicate events

**Solution:**
- Check Make.com datastore module (Module 28, 32)
- Ensure only one scenario is active
- Check Slack app event subscriptions (no duplicate webhooks)

---

### Issue 6: Research Not Working

**Symptoms:** Requests that should trigger research don't

**Checks:**
1. ✓ Perplexity connection is working
2. ✓ Router filter conditions are correct
3. ✓ Request contains research keywords

**Solution:**
- Test Perplexity module independently
- Review Module 4 (Router) filter logic
- Use explicit research keywords: "research", "latest", "study"

---

### Issue 7: Wrong Platform Format

**Symptoms:** Content formatted for wrong platform

**Possible causes:**
- Ambiguous request wording
- System prompt default platform incorrect

**Solution:**
- Be explicit in requests: "Create Instagram posts..."
- Update default platform in system prompt
- Review AI's understanding of platform keywords

---

### Issue 8: Can't Connect to Notion

**Symptoms:** Notion modules fail or show errors

**Checks:**
1. ✓ Notion integration is created
2. ✓ Integration has access to databases
3. ✓ Database IDs are correct

**Solution:**
- Share Notion databases with integration
- Double-check database IDs in Make.com
- Verify Notion API token is valid

---

## 📈 Best Practices

### 1. Writing Effective Requests

**✅ DO:**
```
"Create 3 Instagram posts about meal prep for busy professionals.
Focus on time-saving benefits. Make them practical and actionable."
```

**❌ DON'T:**
```
"meal prep"
```

**Why:** Specific requests give the AI clear direction and produce better results.

---

### 2. Batch Similar Requests

**✅ DO:**
```
"Create:
- 5 Instagram posts about protein
- 3 LinkedIn posts about protein
- 1 YouTube script about protein"
```

**❌ DON'T:**
Send 9 separate messages

**Why:** Batching saves time, costs, and ensures consistency across content.

---

### 3. Provide Context

**✅ DO:**
```
"My audience is fitness beginners aged 25-35.
Create 3 Instagram posts about starting a gym routine.
Address their fear of judgment and lack of knowledge."
```

**❌ DON'T:**
```
"Create posts about gym"
```

**Why:** Context helps AI tailor content to your specific audience.

---

### 4. Iterate and Refine

**✅ DO:**
```
First request: "Create an Instagram post about morning routines"
[Review response]
Refinement: "Make it more humorous and add a personal story angle"
```

**Why:** Treating it like a conversation leads to better final results.

---

### 5. Use Research Wisely

**✅ DO:**
Research requests for:
- Current events
- Recent studies
- Specific statistics
- Trend analysis

**❌ DON'T:**
Use research for general knowledge topics

**Why:** Research uses more resources and takes longer - use when truly needed.

---

### 6. Save Good Prompts

**✅ DO:**
Keep a document of prompts that work well for you

**Example:**
```
"Create [NUMBER] [PLATFORM] posts about [TOPIC] for [AUDIENCE].
Focus on [ANGLE]. Make them [STYLE]."
```

**Why:** Reusable prompt templates speed up your workflow.

---

### 7. Review and Edit

**✅ DO:**
Always review AI-generated content before publishing

**Check for:**
- Accuracy of facts
- Brand voice alignment
- Platform formatting
- Typos or errors
- Relevance to audience

**Why:** AI is powerful but not perfect - human review ensures quality.

---

### 8. Monitor Usage

**✅ DO:**
- Check Make.com operations monthly
- Monitor OpenAI API usage
- Track Perplexity API calls
- Review costs vs. value

**Why:** Prevents surprise bills and helps optimize efficiency.

---

### 9. Keep System Updated

**✅ DO:**
- Update AI models when new versions release
- Refine system prompts based on results
- Adjust platform rules as social media evolves
- Test new features regularly

**Why:** The content landscape changes - your system should too.

---

### 10. Create Content Guidelines

**✅ DO:**
Document your own content rules:
- Brand voice specifics
- Topic boundaries
- Audience preferences
- Format preferences

**Why:** Consistency across all content builds brand recognition.

---

## 🔐 Security & Privacy Considerations

### Data That Flows Through the System:

1. **Your Slack messages** → Sent to Make.com webhook
2. **Message content** → Sent to OpenAI and/or Perplexity AI
3. **AI responses** → Posted back to Slack
4. **Event IDs** → Stored in Make.com datastore
5. **Notion data** (optional) → Read by Make.com

---

### Security Best Practices:

#### ✅ **Protect Your API Keys**

- Never share API keys publicly
- Use environment variables when possible
- Rotate keys if compromised
- Use separate keys for different projects

#### ✅ **Limit Slack Access**

- Only invite bot to necessary channels
- Don't use in channels with sensitive information
- Consider private channels for content creation

#### ✅ **Review Permissions**

- Slack app: Only grant necessary permissions
- Notion: Only share required databases
- Make.com: Use least-privilege connections

#### ✅ **Monitor Usage**

- Check Make.com execution logs regularly
- Review API usage for anomalies
- Set up usage alerts if available

#### ✅ **Data Retention**

- OpenAI: Opt out of training on your data
- Notion: Regularly audit shared integrations
- Make.com: Clear old execution logs periodically

---

### What NOT to Send to the Agent:

❌ Passwords or credentials
❌ Personal identifiable information (PII)
❌ Confidential business information
❌ Financial data
❌ Private customer data
❌ Unpublished sensitive content

---

### Compliance Notes:

If your business is subject to regulations (GDPR, HIPAA, etc.):

- **Review OpenAI's data processing terms**
- **Check Perplexity's data usage policies**
- **Consider enterprise agreements** for additional protections
- **Document data flow** for compliance audits
- **Implement additional access controls** as needed

---

## 💡 Advanced Use Cases

### Use Case 1: Content Repurposing Workflow

**Scenario:** You have a 2000-word blog post and want to repurpose it across all platforms.

**Request:**
```
I have this blog post about [TOPIC]:

[Paste blog post]

Create:
- 10 Instagram posts (mix of short and long)
- 5 LinkedIn posts (varying angles)
- 3 YouTube script intros (different hooks)
- 5 Email subject lines
- 1 Twitter thread (10 tweets)

Make sure each piece stands alone but maintains consistent messaging.
```

**Result:** Complete content suite from one source material.

---

### Use Case 2: Weekly Content Planning

**Scenario:** Plan an entire week of content at once.

**Request:**
```
Create a week of Instagram content about [THEME]:

Monday: Motivation post
Tuesday: Educational post
Wednesday: Behind-the-scenes
Thursday: Testimonial/social proof
Friday: Tips post
Saturday: Engagement/question post
Sunday: Inspirational quote

Target audience: [DESCRIPTION]
Brand voice: [DESCRIPTION]
```

**Result:** 7 ready-to-schedule posts with strategic variety.

---

### Use Case 3: Trend Jacking

**Scenario:** Quickly create content around a trending topic.

**Request:**
```
Research the latest trending topic about [SUBJECT] today.
Create 3 Instagram posts that tie this trend to [YOUR NICHE].
Make them timely and relevant.
```

**Result:** Current, trend-aware content ready to post immediately.

---

### Use Case 4: Content Variations Testing

**Scenario:** Test different messaging angles to see what resonates.

**Request:**
```
Create 5 different versions of an Instagram post about [TOPIC]:

Version 1: Emotional/story-driven
Version 2: Data/statistics-driven
Version 3: Humorous/lighthearted
Version 4: Contrarian/challenging assumptions
Version 5: Practical/how-to

Same core message, different approaches.
```

**Result:** Multiple angles to test with your audience.

---

### Use Case 5: Audience Segmentation

**Scenario:** Create different content for different audience segments.

**Request:**
```
Create content about [TOPIC] for 3 different audiences:

Audience 1: Beginners (no prior knowledge)
Audience 2: Intermediate (some experience)
Audience 3: Advanced (expert level)

For each, create 2 Instagram posts with appropriate depth and language.
```

**Result:** Tailored content for each segment of your audience.

---

### Use Case 6: Launch Campaign

**Scenario:** Create comprehensive content for a product/service launch.

**Request:**
```
I'm launching [PRODUCT/SERVICE] next week. Create a launch campaign:

Pre-launch (3 days before):
- 3 teaser Instagram posts
- 1 LinkedIn announcement
- 2 email subject lines

Launch day:
- 1 Instagram announcement post
- 1 LinkedIn thought leadership post
- 1 YouTube script
- Launch email copy

Post-launch (3 days after):
- 2 Instagram value posts
- 1 LinkedIn results post
- Follow-up email

Product details: [DESCRIPTION]
Target audience: [DESCRIPTION]
Key benefits: [LIST]
```

**Result:** Complete campaign content suite.

---

### Use Case 7: SEO Content Creation

**Scenario:** Create SEO-optimized content around keywords.

**Request:**
```
Research the keyword "[KEYWORD]" and related terms.
Create content optimized for SEO:

- 1 long-form LinkedIn post (1500+ words) using the keyword naturally
- 5 Instagram posts targeting related long-tail keywords
- YouTube script with keyword in title, description, and throughout

Focus on providing value while naturally incorporating keywords.
```

**Result:** SEO-aware content across platforms.

---

### Use Case 8: Seasonal Content Planning

**Scenario:** Plan content for upcoming holidays or seasons.

**Request:**
```
Create content for [HOLIDAY/SEASON] related to [YOUR NICHE]:

Weeks before:
- 3 preparation/anticipation posts

During:
- 2 timely/celebratory posts

After:
- 2 reflection/recap posts

For Instagram and LinkedIn. Keep brand voice consistent.
```

**Result:** Strategic seasonal content calendar.

---

## 📚 Frequently Asked Questions (FAQs)

### General Questions

**Q: How much does it cost to run this system?**

**A:** Monthly costs typically include:
- Make.com: $9-$29/month (depending on usage)
- OpenAI: $20-$100/month (depends on volume)
- Perplexity: $20/month (optional, for research features)
- Notion: Free or $10/month (optional)

**Total:** $49-$159/month for full functionality.

---

**Q: Can I use this for multiple brands/clients?**

**A:** Yes! Options:
1. Use one instance and specify brand in each request
2. Create separate Make.com scenarios for each brand
3. Customize system prompts per brand

---

**Q: Is my content data secure?**

**A:** Your data passes through:
- Make.com (EU/US servers)
- OpenAI (US servers, can opt out of training)
- Perplexity (US servers)
- Slack (US/EU servers)

All use encryption in transit. For sensitive content, review each service's privacy policy.

---

**Q: Can I cancel or pause at any time?**

**A:** Yes! Simply:
- Turn off the Make.com scenario (stops all processing)
- Pause or cancel API subscriptions
- Keep the setup to restart anytime

---

### Technical Questions

**Q: What if OpenAI releases a new model?**

**A:** Update the model name in Make.com:
1. Click OpenAI module
2. Change "Model" field to new model name
3. Save

Common models: `gpt-4o`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`

---

**Q: Can I add more AI services?**

**A:** Yes! Make.com supports:
- Anthropic Claude
- Google Gemini
- Other custom APIs

Just add modules and connect them.

---

**Q: How do I back up my scenario?**

**A:** In Make.com:
1. Click three dots (⋮) at top
2. Select "Export Blueprint"
3. Save JSON file locally
4. Store securely

---

**Q: Can this work with Microsoft Teams instead of Slack?**

**A:** Yes! You'd need to:
1. Replace Slack modules with Teams modules in Make.com
2. Set up Teams bot and webhook
3. Configure permissions

The logic remains the same.

---

**Q: What's the maximum content length it can generate?**

**A:** Depends on model token limits:
- GPT-4 Turbo: Up to ~4000 words per request
- GPT-4o: Up to ~6000 words per request

For longer content, break into multiple requests.

---

### Usage Questions

**Q: Can I edit the content after it's generated?**

**A:** Yes! The content is posted to Slack where you can:
1. Copy and edit in any text editor
2. Request revisions with a follow-up message
3. Use as a draft for further refinement

---

**Q: How do I request revisions?**

**A:** Simply reply in the same thread:

```
First request: "Create an Instagram post about meal prep"
[AI responds]
Revision: "Make it shorter and add more emojis"
[AI responds with revised version]
```

---

**Q: Can it generate images?**

**A:** Not in the current setup, but you can add:
- DALL-E module (OpenAI's image generation)
- Midjourney API
- Stable Diffusion

These would require additional setup and costs.

---

**Q: Can multiple people use this at once?**

**A:** Yes! Multiple users can send requests simultaneously. The system:
- Processes them in parallel
- Responds to each in their respective threads
- Handles concurrency automatically

---

**Q: What languages does it support?**

**A:** OpenAI GPT-4 supports 50+ languages. To use:

```
"Create 3 Instagram posts about fitness in Spanish"
```

or

```
"Translate this content to French: [content]"
```

---

### Troubleshooting Questions

**Q: Why is the response slow?**

**A:** Typical response times:
- Simple (10-15 sec): Normal
- Complex (20-30 sec): Normal
- Research (30-40 sec): Normal
- 60+ seconds: Check API rate limits or service status

---

**Q: What if I hit API rate limits?**

**A:** Solutions:
1. Upgrade your API plan
2. Add delays between requests in Make.com
3. Reduce request frequency
4. Spread requests across time

---

**Q: Can I test without using real API calls?**

**A:** In Make.com:
1. Right-click any module
2. Select "Choose where to start"
3. Use "Run once" with test data

This helps debug without costs.

---

## 🎓 Learning Resources

### Official Documentation

- **Make.com:** https://www.make.com/en/help
- **OpenAI API:** https://platform.openai.com/docs
- **Slack API:** https://api.slack.com/docs
- **Perplexity AI:** https://docs.perplexity.ai
- **Notion API:** https://developers.notion.com

### Recommended Tutorials

**Make.com Basics:**
- Make.com Academy (free courses)
- YouTube: "Make.com tutorials for beginners"

**AI Prompt Engineering:**
- OpenAI Prompt Engineering Guide
- "The Art of ChatGPT Prompting" (free ebook)

**Content Strategy:**
- Platform-specific best practice guides
- Social media content calendars

### Community Support

- **Make.com Community:** community.make.com
- **OpenAI Forum:** community.openai.com
- **Slack API Community:** api.slack.com/community

---

## 🚀 Next Steps & Expansion Ideas

Once you're comfortable with the basic system, consider these enhancements:

### 1. Add Image Generation

**What:** Generate images to accompany text content

**How:** Add DALL-E or Midjourney modules to Make.com

**Benefit:** Complete visual + text content packages

---

### 2. Implement Content Calendar

**What:** Schedule content creation for specific dates

**How:** Use Make.com scheduler + Google Calendar integration

**Benefit:** Automated content pipeline

---

### 3. Add Analytics Integration

**What:** Track performance of generated content

**How:** Connect to social media analytics APIs

**Benefit:** Optimize content strategy with data

---

### 4. Create Content Library

**What:** Store all generated content in organized database

**How:** Expand Notion integration with categorization

**Benefit:** Easy reference and content repurposing

---

### 5. Implement Approval Workflow

**What:** Review content before it goes live

**How:** Add Slack buttons (Approve/Reject/Edit)

**Benefit:** Quality control and team collaboration

---

### 6. Add Multiple Brand Profiles

**What:** Switch between different brand voices

**How:** Create variables in Make.com for brand selection

**Benefit:** Serve multiple clients from one system

---

### 7. Integrate Scheduling Tools

**What:** Auto-schedule approved content

**How:** Connect to Buffer, Hootsuite, or Later

**Benefit:** True end-to-end automation

---

### 8. Add Voice Input

**What:** Create content from voice messages

**How:** Add Whisper API (OpenAI speech-to-text)

**Benefit:** Create content on-the-go

---

### 9. Implement A/B Testing

**What:** Generate and track multiple variations

**How:** Add Google Sheets + analytics tracking

**Benefit:** Data-driven content optimization

---

### 10. Create Performance Reporting

**What:** Weekly/monthly content performance reports

**How:** Aggregate analytics + AI summary

**Benefit:** Strategic insights and improvements

---

## 📝 Quick Reference Sheet

### Essential Commands

```
Basic Request:
"Create [NUMBER] [PLATFORM] posts about [TOPIC]"

With Research:
"Research [TOPIC] and create [NUMBER] posts"

Multiple Platforms:
"Create content about [TOPIC]:
- [NUMBER] [PLATFORM1] posts
- [NUMBER] [PLATFORM2] posts"

Revisions:
"Make it [ADJUSTMENT]" (in same thread)

Specific Style:
"Create [CONTENT] in [STYLE] style for [AUDIENCE]"
```

---

### Platform Keywords

- **Instagram:** "IG", "Instagram", "post", "caption", "carousel"
- **LinkedIn:** "LI", "LinkedIn", "professional"
- **YouTube:** "YT", "YouTube", "script", "video"
- **Email:** "email", "newsletter", "subject line"
- **Twitter:** "Twitter", "X", "tweet", "thread"

---

### Style Keywords

- **Funny:** "humorous", "funny", "lighthearted"
- **Professional:** "professional", "formal", "corporate"
- **Casual:** "casual", "conversational", "friendly"
- **Educational:** "educational", "informative", "teaching"
- **Inspirational:** "inspirational", "motivational", "uplifting"

---

### Research Triggers

- "research"
- "latest"
- "current"
- "recent study"
- "2024" (or current year)
- "what are the"
- "statistics"

---

### Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| No response | Check Make.com scenario is ON |
| Slow response | Normal for research requests (30-40s) |
| Wrong format | Be explicit about platform |
| Poor quality | Provide more context in request |
| API error | Check API keys and credits |

---

## 🎉 Congratulations!

You now have a complete understanding of your Content Creation Agent system!

### What You've Learned:

✅ How the system works end-to-end
✅ Complete setup process
✅ How to use it effectively
✅ Customization options
✅ Troubleshooting techniques
✅ Advanced use cases
✅ Security best practices
✅ Expansion possibilities

---

### Your Next Actions:

1. **Set up** your system following the step-by-step guide
2. **Test** with simple requests to verify it works
3. **Customize** the system prompts to your brand
4. **Experiment** with different request styles
5. **Monitor** usage and costs for first month
6. **Refine** based on results and feedback
7. **Expand** with additional features as needed

---

### Need Help?

If you run into issues:

1. **Check** this documentation first
2. **Review** Make.com execution logs
3. **Test** each component individually
4. **Consult** official documentation links
5. **Reach out** to respective support teams

---

### Share Your Success!

Once you're up and running, consider:
- Documenting your unique customizations
- Sharing your favorite prompts
- Tracking time saved and value created
- Iterating on your content strategy

---

## 📄 Document Version

**Version:** 1.0
**Last Updated:** 2025-11-06
**System:** Content Creation Agent (Make.com Blueprint)
**Compatible With:** Make.com, Slack, OpenAI, Perplexity AI, Notion

---

### Change Log

**v1.0 (2025-11-06):**
- Initial comprehensive documentation
- Complete setup guide
- All use cases and examples
- Troubleshooting section
- Security guidelines
- FAQ section

---

## 📎 Appendix

### A. Glossary of Terms

**API (Application Programming Interface):** A way for different software to communicate with each other.

**Webhook:** An automated message sent from one app to another when something happens.

**Blueprint:** A pre-configured automation template in Make.com that you can import and customize.

**Module:** A single step or action in a Make.com scenario (like "Send Message" or "Generate Content").

**System Prompt:** Instructions given to the AI that define its personality, knowledge, and behavior.

**Token:** The unit of text that AI models use to measure input/output. Roughly 4 characters = 1 token.

**Event ID:** A unique identifier for each message or event in Slack.

**Router:** A module that directs the flow to different paths based on conditions.

**Datastore:** Internal storage in Make.com for saving and retrieving data.

**OAuth:** A secure authorization method that lets apps access your account without seeing your password.

**Connection:** A saved link between Make.com and another service (like Slack or OpenAI).

---

### B. System Prompt Template

Here's a customizable template for your system prompt:

```
You are a Content Repurposing Assistant for [YOUR BRAND NAME].

BRAND IDENTITY:
- Industry: [YOUR INDUSTRY]
- Target Audience: [YOUR AUDIENCE]
- Brand Voice: [YOUR VOICE DESCRIPTION]
- Tone: [YOUR TONE]

BRAND VALUES:
- [VALUE 1]
- [VALUE 2]
- [VALUE 3]

CONTENT GUIDELINES:

ALWAYS:
- [GUIDELINE 1]
- [GUIDELINE 2]
- [GUIDELINE 3]

NEVER:
- [FORBIDDEN 1]
- [FORBIDDEN 2]
- [FORBIDDEN 3]

PLATFORM-SPECIFIC RULES:

INSTAGRAM:
- Hook: [YOUR RULES]
- Length: [YOUR RULES]
- Hashtags: [YOUR RULES]
- Emojis: [YOUR RULES]

LINKEDIN:
- Hook: [YOUR RULES]
- Length: [YOUR RULES]
- Formatting: [YOUR RULES]
- Tone: [YOUR RULES]

YOUTUBE:
- Hook: [YOUR RULES]
- Structure: [YOUR RULES]
- Pacing: [YOUR RULES]

EMAIL:
- Subject Line: [YOUR RULES]
- Preview Text: [YOUR RULES]
- Body: [YOUR RULES]
- CTA: [YOUR RULES]

DEFAULT BEHAVIOR:
If the user doesn't specify, default to [YOUR DEFAULT].

When interpreting requests:
- [INTERPRETATION RULE 1]
- [INTERPRETATION RULE 2]
- [INTERPRETATION RULE 3]

Your goal is to transform source material or ideas into high-quality,
platform-optimized content that resonates with [YOUR AUDIENCE] and
drives [YOUR DESIRED OUTCOMES].
```

---

### C. Make.com Scenario Overview Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     MODULE MAP                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [15] Webhook Trigger (Slack Event)                         │
│         ↓                                                    │
│  [18] Router (Verification or Process?)                     │
│         ├─→ [17] Webhook Response (Verification)            │
│         └─→ [19] Webhook Response (Ack Message)             │
│                 ↓                                            │
│             [32] Check if Processed                          │
│                 ↓                                            │
│             [33] Router (Processed?)                         │
│                 ├─→ STOP (Already Processed)                │
│                 └─→ [28] Store Event ID                     │
│                         ↓                                    │
│                     [13] Notion Search 1                     │
│                         ↓                                    │
│                     [14] Notion Search 2                     │
│                         ↓                                    │
│                     [4] Router (Research?)                   │
│                         ├─→ [2] OpenAI Generate              │
│                         │       ↓                            │
│                         │   [29] Slack Reply                 │
│                         │                                    │
│                         └─→ [6] Perplexity Research          │
│                                 ↓                            │
│                             [7] OpenAI Generate              │
│                                 ↓                            │
│                             [30] Slack Reply                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### D. API Rate Limits Reference

**OpenAI (GPT-4):**
- Free tier: N/A
- Tier 1 ($5+ spent): 500 RPM (requests per minute)
- Tier 2 ($50+ spent): 5,000 RPM
- Tier 3 ($100+ spent): 10,000 RPM

**Perplexity AI:**
- Standard: 20 RPM
- Pro: 40 RPM
- Enterprise: Custom

**Slack API:**
- Posting messages: 1 per second per channel
- Webhook responses: No specific limit

**Make.com:**
- Free: 1,000 operations/month
- Core ($9): 10,000 operations/month
- Pro ($16): 10,000 operations/month
- Teams ($29): 10,000 operations/month

---

### E. Cost Calculator

**Monthly Usage Estimator:**

```
MAKE.COM:
Operations per request: [6-12]
Monthly requests: [YOUR ESTIMATE]
Total operations: requests × operations per request
Needed plan: [Free (1K) / Core (10K) / Pro (10K) / Teams (10K)]
Cost: $[0-29]

OPENAI:
Cost per simple request: $0.02-0.05
Cost per complex request: $0.05-0.15
Monthly requests: [YOUR ESTIMATE]
Estimated cost: requests × average cost
Total: $[YOUR ESTIMATE]

PERPLEXITY (if using research):
Monthly cost: $20 (flat rate)

NOTION (if using):
Free or $10/month

TOTAL MONTHLY COST: $[YOUR TOTAL]
```

---

### F. Content Calendar Template

Use this template for planning requests:

| Date | Platform | Topic | Angle | Request Status |
|------|----------|-------|-------|----------------|
| Mon | Instagram | [Topic] | [Angle] | [Pending/Done] |
| Tue | LinkedIn | [Topic] | [Angle] | [Pending/Done] |
| Wed | Instagram | [Topic] | [Angle] | [Pending/Done] |
| Thu | YouTube | [Topic] | [Angle] | [Pending/Done] |
| Fri | Email | [Topic] | [Angle] | [Pending/Done] |
| Sat | Instagram | [Topic] | [Angle] | [Pending/Done] |
| Sun | LinkedIn | [Topic] | [Angle] | [Pending/Done] |

---

### G. Support Contact Information

**Make.com Support:**
- Email: support@make.com
- Help Center: make.com/en/help
- Community: community.make.com

**OpenAI Support:**
- Help Center: help.openai.com
- Community: community.openai.com
- Status: status.openai.com

**Slack Support:**
- Help Center: slack.com/help
- API Docs: api.slack.com
- Status: status.slack.com

**Perplexity Support:**
- Email: support@perplexity.ai
- Docs: docs.perplexity.ai

**Notion Support:**
- Help Center: notion.so/help
- Community: notion.so/community
- API Docs: developers.notion.com

---

## 🏁 Final Thoughts

This Content Creation Agent system represents a powerful fusion of:
- **Automation** (Make.com)
- **Communication** (Slack)
- **Intelligence** (OpenAI, Perplexity)
- **Organization** (Notion)

Together, these tools create a seamless content creation workflow that can:
- Save hours per week
- Maintain brand consistency
- Scale content production
- Improve content quality
- Enable rapid iteration

The initial setup requires some technical configuration, but once running,
it's as simple as having a conversation with an expert content creator who
never sleeps, never forgets your brand voice, and can create platform-perfect
content in seconds.

**Your content creation superpower is now activated. Go create amazing things! 🚀**

---

*End of Documentation*