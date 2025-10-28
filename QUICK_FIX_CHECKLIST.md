# ⚡ QUICK FIX CHECKLIST - Stop the Slack Loop

## 🚨 DO THIS FIRST (5 minutes)

### 1. Find Your Bot's User ID (CRITICAL!)

**Option A: Check in Slack**
1. Open Slack workspace
2. Click on your bot's profile picture
3. Click "More" → "Copy member ID"
4. Save this ID! (format: U09XXXXXXXXX)

**Option B: Check Make.com execution history**
1. Go to Make.com scenario
2. Click on a recent execution
3. Look at Module 15 output
4. Find `event.user` value when bot posted
5. That's your bot's user ID!

### 2. Update EVERY Filter to Block This Bot ID

Search your scenario for these modules and add the bot ID filter:

- ✅ Module 28 (Store Event) - Add: `event.user ≠ [YOUR_BOT_ID]`
- ✅ Module 32 (Check Duplicate) - Add: `event.user ≠ [YOUR_BOT_ID]`
- ✅ Module 13 (Fetch Notion) - Add: `event.user ≠ [YOUR_BOT_ID]`
- ✅ Module 2 (OpenAI - No Research) - Add: `event.user ≠ [YOUR_BOT_ID]`
- ✅ Module 6 (Perplexity Research) - Add: `event.user ≠ [YOUR_BOT_ID]`

### 3. Add `subtype` Check (Most Important!)

In EVERY filter above, also add:
- ✅ `event.subtype` does NOT exist

**Why?** Bot messages have `subtype: "bot_message"`. This catches ALL bots!

## 🔧 CRITICAL FIXES (10 minutes)

### Fix #1: Move Webhook Response FIRST

Current (WRONG):
```
Check Duplicate → Store Event → Respond 200 → Process
```

Correct (RIGHT):
```
Check Duplicate → Respond 200 → Store Event → Process
```

**How to fix**:
1. Find Module 19 (Webhook Response)
2. Drag it to be RIGHT AFTER Module 33 (Router)
3. Module 28 (Store Event) should come AFTER Module 19

### Fix #2: Fix the thread_ts

- Module 29: Keep as `{{15.event.ts}}`
- Module 30: Change from `{{15.event.event_ts}}` to `{{15.event.ts}}`

### Fix #3: Better Datastore Key

Module 32 AND Module 28, change key to:
```
{{15.event_id}}_{{15.event.ts}}
```

## 🧪 TEST IT (5 minutes)

1. Turn OFF the scenario
2. Clear the datastore completely
3. Turn ON the scenario
4. Send ONE test message in Slack
5. Count responses - should be exactly ONE
6. Wait 10 seconds - should be NO MORE responses

## ✅ SUCCESS CRITERIA

- [ ] Bot posts ONCE per user message
- [ ] No duplicate responses
- [ ] Datastore grows by 1 per message
- [ ] Make.com shows 1 execution per message (not 10+)

## 🆘 STILL LOOPING?

The bot user ID is wrong! Do this:

1. Turn OFF scenario
2. Add "Tools → Set Variable" right after Module 15
3. Variable name: `debug_user`
4. Value: `{{15.event.user}} | {{15.event.bot_id}} | {{15.event.subtype}}`
5. Add "Tools → Send Email" after that
6. Email yourself the variable value
7. Turn ON scenario
8. Trigger ONE message
9. Check your email - you'll see the ACTUAL IDs
10. Use THOSE IDs in your filters!

## 📋 Copy-Paste Filters

### Universal Bot Detection Filter
Add this to EVERY content-processing module:

```
Conditions (ALL must match):
- event.subtype does NOT exist
- event.bot_id does NOT exist
- event.user not equal to "B09PJ8DT2HE"
- event.user not equal to "U09JV1FUPMJ"
- event.user not equal to "[YOUR_ACTUAL_BOT_USER_ID]"
```

Replace `[YOUR_ACTUAL_BOT_USER_ID]` with the ID from Step 1!

## ⏱️ Expected Timeline

- **Immediate**: Turn off scenario, find bot ID (5 min)
- **Quick Fix**: Update filters with bot ID (5 min)
- **Full Fix**: Reorder modules, fix keys (10 min)
- **Testing**: Verify single response (5 min)

**Total: ~25 minutes to fix**

## 🎯 The #1 Cause

**Your bot's messages are not being filtered!**

The blueprint checks for:
- `B09PJ8DT2HE` (old bot?)
- `U09JV1FUPMJ` (old user?)

But YOUR bot is posting with a DIFFERENT user ID that's not in the filters!

**Find that ID and add it to EVERY filter. That's the fix.**

## Need Visual Guide?

See `LOOP_FIX_GUIDE.md` for detailed explanations with examples.
