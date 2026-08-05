# Configuration

Environment variables and setup for the bot.

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

### Required Variables

| Variable | Type | Description |
|----------|------|-------------|
| `API_KEY` | string | Telegram Bot API token (from @BotFather) |
| `MY_ID` | positive integer | Your Telegram user ID |
| `PHOTO_CHAT_ID` | negative integer | Chat ID for photo storage |
| `VIDEO_CHAT_ID` | negative integer | Chat ID for video storage |

### Getting Your User ID

1. Start a chat with your bot
2. Send `/my_id`
3. Bot will reply with your numeric user ID

### Getting Chat IDs

1. Add bot to a group chat
2. Send `/chat_id`
3. Bot will reply with the chat ID (negative for groups)

### Example .env

```
API_KEY=0000000000:AAA_AAaAAaAaA_AAa_aAAAaaAaaaAAAaA_A
MY_ID=87654321
PHOTO_CHAT_ID=-1001234567890
VIDEO_CHAT_ID=-1009876543210
```

## Multi-Bot Deployment

For running multiple bot instances with different configurations:

1. Create `.env.1`, `.env.2`, `.env.3`, `.env.4` files
2. Each file contains different `API_KEY` and chat IDs
3. Use `./compose.sh` to deploy multiple bots

Each bot runs independently with its own configuration:

```
bot-1 → .env.1 (port 3001)
bot-2 → .env.2 (port 3002)
bot-3 → .env.3 (port 3003)
bot-4 → .env.4 (port 3004)
```

## Node Environment

Set `NODE_ENV=production` in Docker/Compose environments to skip loading `.env` files.
