# Slack Endless Loop - Troubleshooting & Fix Guide

## 🚨 CRITICAL ISSUES FOUND IN YOUR BLUEPRINT

I've analyzed your Make.com blueprint and found several issues that could cause endless loops:

## Problem 1: Webhook Response Timing ⏱️

**Current Flow (WRONG)**:
```
Event Received → Check Duplicate → Store Event ID → Respond 200 → Process Message → Post to Slack
```

**Issue**: Webhook response (Module 19) happens AFTER storing the event (Module 28). If storage takes >3 seconds, Slack retries, causing duplicates.

**Fix**: Respond to webhook IMMEDIATELY after duplicate check, BEFORE storing:

```
Event Received → Respond 200 FIRST → Check Duplicate → Store Event ID → Process Message
```

### Implementation Fix:

**Move Module 19 (Webhook Response) to BEFORE Module 28 (Store Event)**

Current order in your blueprint:
1. Module 32: Check if exists
2. Module 33: Router
3. Module 28: Store event ID ❌ TOO LATE
4. Module 19: Respond 200 ❌ TOO LATE
5. Modules 13, 14: Fetch Notion
6. Content generation & Slack post

**Correct order should be**:
1. Module 32: Check if exists
2. Module 33: Router
3. **Module 19: Respond 200 ✅ IMMEDIATELY**
4. Module 28: Store event ID ✅ AFTER RESPONSE
5. Modules 13, 14: Fetch Notion
6. Content generation & Slack post

## Problem 2: Bot Detection Logic 🤖

**Current Bot Filters**:
```javascript
// Filter condition checks:
authorizations[].is_bot does NOT exist
OR
authorizations[].is_bot === "false"
```

**Issue**: These are OR conditions (any one can match), not AND. Plus, you're checking TWO different user IDs:
- `B09PJ8DT2HE` (bot ID)
- `U09JV1FUPMJ` (user ID)

**Your bot is likely posting with a DIFFERENT user ID that's not being filtered!**

**IMPORTANT:** Previous versions of this guide referenced `event.subtype`, but this field does NOT exist in Make.com mappings! Use `event.bot_id` instead.

### How to Find Your Bot's User ID:

1. **In Make.com**, add a new module right after Module 15 (webhook):
   - Add "Tools > Set Variable"
   - Variable: `bot_user_check`
   - Value: `{{15.event.user}}`
   - **Run the scenario and check what user ID appears when the bot posts**

2. **Alternative: Check in Slack**:
   - Go to your Slack workspace
   - Click on the bot's name
   - Look for "Member ID" in the profile
   - It will be something like `U09XXXXXXXXX`

### Fix Bot Detection:

**Update Module 13 and Module 28 filters** to include BOTH conditions:

```javascript
// CORRECT filter logic:
event.bot_id does NOT exist
AND
event.user !== "B09PJ8DT2HE"
AND
event.user !== "U09JV1FUPMJ"
AND
event.user !== "YOUR_ACTUAL_BOT_USER_ID"  // ← ADD THIS!
```

**Why `event.bot_id` matters**: Bot messages have this field. This is the MOST RELIABLE way to detect bots!

**Note:** `event.subtype` does NOT exist in Make.com mappings, even though it exists in Slack's raw API.

## Problem 3: Using event.ts vs event.event_ts 📅

**I found an inconsistency**:

Module 30 uses:
```javascript
thread_ts: "{{15.event.event_ts}}"  // ← event.event_ts
```

Module 29 uses:
```javascript
thread_ts: "{{15.event.ts}}"  // ← event.ts
```

**This could cause threading issues!**

### Fix:

**Use `{{15.event.ts}}` consistently** in BOTH Module 29 and Module 30.

For Slack Events API:
- `event.ts` = timestamp of the message (correct)
- `event.event_ts` = timestamp of the event envelope (wrong for threading)

## Problem 4: Datastore Key Structure 🔑

**Current Key**: `{{15.event_id}}`

**Potential Issue**: If Slack retries the SAME event, it will have the same `event_id`, which is good. BUT if your bot's response creates a NEW event, it will have a DIFFERENT `event_id`.

### Better Approach:

Use a **composite key** that includes both event_id AND message timestamp:

```javascript
Key: "{{15.event_id}}_{{15.event.ts}}"
```

This ensures even if Slack generates multiple event_ids for the same message, you'll catch it by timestamp.

## Problem 5: Filter Conditions Order 🎯

**Your current filter in Module 32** has multiple OR conditions:

```javascript
[
  [condition1, condition2],  // ← Group 1 (all must be true)
  [condition3],              // ← OR Group 2
  [condition4],              // ← OR Group 3
  [condition5],              // ← OR Group 4
  [condition6]               // ← OR Group 5
]
```

**This means**: If ANY of the outer groups is true, the filter passes. This is TOO PERMISSIVE.

### Fix:

**Combine ALL conditions into a SINGLE group** (all must be true):

```javascript
[
  [
    {condition1},
    {condition2},
    {condition3},
    {condition4},
    {condition5},
    {condition6}
  ]
]
```

## 🔧 STEP-BY-STEP FIX PROCEDURE

### Step 1: Find Your Bot's User ID

1. In your Make.com scenario, **temporarily disable** all modules after Module 19
2. Add a **"Send email"** module right after Module 15
3. Email content:
   ```
   Event User: {{15.event.user}}
   Bot ID: {{15.event.bot_id}}
   Event Type: {{15.event.type}}
   ```
4. Trigger the loop one more time
5. Check your email to see the ACTUAL user ID being used

### Step 2: Update Bot Filters

1. **Module 28** (Store Event) - Update filter "Not Already Processed":
   ```javascript
   Conditions (ALL must match):
   - event.type equals "event_callback"
   - event.event.type equals "message"
   - event.bot_id does NOT exist  ← ADD THIS
   - event.user not equal to "B09PJ8DT2HE"
   - event.user not equal to "U09JV1FUPMJ"
   - event.user not equal to "YOUR_BOT_USER_ID"  ← ADD THIS
   - event.user is not empty
   ```

2. **Module 13** (Fetch Notion) - Update filter "Normal Events":
   ```javascript
   Conditions (ALL must match):
   - event.type equals "event_callback"
   - event.event.type equals "message"
   - event.bot_id does NOT exist  ← ADD THIS
   - event.user not equal to "U09JV1FUPMJ"
   - event.user not equal to "YOUR_BOT_USER_ID"  ← ADD THIS
   ```

### Step 3: Fix Module Order

1. In Module 33 (Router after duplicate check), **reorganize the route**:
   - Move **Module 19** (Webhook Response) to be the FIRST module after the router
   - Then Module 28 (Store Event)
   - Then everything else

**Correct flow**:
```
Module 32: Check if exists
    ↓
Module 33: Router (if NOT exists)
    ↓
Module 19: Respond 200 OK ← FIRST!
    ↓
Module 28: Store event ID
    ↓
Module 13: Fetch Notion
    ↓
Module 14: Fetch Notion
    ↓
Content generation...
```

### Step 4: Fix Timestamp Consistency

1. **Module 30** - Change from:
   ```javascript
   thread_ts: "{{15.event.event_ts}}"
   ```
   To:
   ```javascript
   thread_ts: "{{15.event.ts}}"
   ```

### Step 5: Improve Datastore Key

1. **Module 28** - Change the key from:
   ```javascript
   key: "{{15.event_id}}"
   ```
   To:
   ```javascript
   key: "{{15.event_id}}_{{15.event.channel}}_{{15.event.ts}}"
   ```

2. **Module 32** - Change the key lookup to match:
   ```javascript
   key: "{{15.event_id}}_{{15.event.channel}}_{{15.event.ts}}"
   ```

### Step 6: Add Emergency Stop

Add a **filter right after Module 15** (webhook trigger) to catch runaway loops:

1. Add new **Router** module after Module 15, BEFORE Module 18
2. Add route with filter:
   ```javascript
   {{now}} - {{parseDate(15.event.ts; "X")}} > 300
   ```
   (Only process events newer than 5 minutes old)
3. If event is too old, respond with 200 and stop

## 🧪 TESTING THE FIX

### Test 1: Verify Bot Messages Are Ignored

1. **Before**: Check your datastore - it probably has entries with your bot's user ID
2. Clear the datastore
3. Post a test message as yourself
4. **Expected**: Bot should respond ONCE
5. Check datastore - should have ONE entry
6. Check event user ID - should be YOUR user ID, not the bot's

### Test 2: Verify Duplicate Prevention

1. Use Make.com's "Run Once" feature
2. Send same event payload twice (copy from history)
3. **Expected**: First run processes, second run stops at Module 32

### Test 3: Verify No Loop

1. Send message: "Create 1 Instagram post about sleep"
2. **Expected**: Bot responds with ONE post
3. Wait 10 seconds
4. **Expected**: No additional messages appear
5. Check Make.com execution history: Should show only 1-2 executions (not dozens)

## 🚨 EMERGENCY: Stop The Loop NOW

If the loop is currently running:

1. **Immediate**: In Make.com, click the scenario → Turn it OFF
2. Go to your Slack workspace
3. **Remove the bot from the channel temporarily**:
   - Go to channel details
   - Members tab
   - Remove the bot
4. Clear the datastore:
   - Data stores → Slack Event Loop Prevention
   - Delete all records
5. Implement the fixes above
6. **Test in a different channel first**:
   - Create a test channel
   - Invite bot to test channel
   - Update `SLACK_CHANNEL_ID` in filters to test channel
   - Turn scenario back on
   - Send ONE test message
   - Verify single response
7. Once working, move back to production channel

## 📊 Monitoring Checklist

After implementing fixes, monitor for 24 hours:

- [ ] Check Make.com execution count (should be low)
- [ ] Check datastore size (should grow slowly, one per message)
- [ ] Check Slack for duplicate responses (should be zero)
- [ ] Check webhook response time (should be <1 second)
- [ ] Check OpenAI/Perplexity usage (should match message count)

## 🔍 Debug Mode

Add these temporary debug modules to trace the issue:

1. After Module 15 (Webhook):
   ```
   Send Email:
   Subject: Event Received
   Body:
     Event ID: {{15.event_id}}
     User: {{15.event.user}}
     Bot ID: {{15.event.bot_id}}
     Event Type: {{15.event.type}}
     Text: {{15.event.text}}
   ```

2. After Module 32 (Duplicate Check):
   ```
   Send Email:
   Subject: Duplicate Check Result
   Body:
     Exists: {{32.exist}}
     Event ID: {{15.event_id}}
   ```

3. After Module 28 (Store Event):
   ```
   Send Email:
   Subject: Event Stored
   Body:
     Stored Key: {{28.key}}
   ```

Remove these after debugging.

## 📝 Quick Reference: Complete Filter Set

Copy these exact filters:

### Module 32 (Check Duplicate) - NO filter needed
Just check if key exists.

### Module 28 (Store Event) - Filter: "ID doesn't exist"
```
Condition Groups (ALL of the following):
[
  [ exist equals false ]
]
```

### Module 13 (Fetch Notion) - Filter: "Normal Events"
```
Condition Groups (ALL of the following):
[
  [
    event.type equals "event_callback",
    event.event.type equals "message",
    event.bot_id does NOT exist,
    authorizations[].is_bot equals "false",
    event.user not equal to "U09JV1FUPMJ",
    event.user not equal to "[YOUR_BOT_USER_ID]"
  ]
]
```

**Note:** `event.subtype` doesn't exist in Make.com mappings!

### Module 2/6 (Content Generation) - Add bot check to existing filters
```
Existing conditions
AND
event.bot_id does NOT exist
```

## Need More Help?

If the loop continues after these fixes:

1. Export your scenario and check the execution history
2. Look for the ACTUAL user ID in successful runs
3. Check if event.bot_id exists for bot messages
4. Verify the datastore is actually storing records
5. Check if multiple scenarios are running (duplicate webhooks)

The most common cause is **bot user ID not being filtered correctly**. The second most common is **webhook response timing**.

Fix these two, and 99% of loops will stop.
