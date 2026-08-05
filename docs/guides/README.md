# Guides

Usage guides for the bot.

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start development mode
npm run dev
```

### Development Mode

`npm run dev` runs:
- TypeScript compiler in watch mode
- Bot with nodemon (auto-restarts on changes)

## Docker Deployment

### Build Image

```bash
docker build -t media-mover-bot .
```

### Single Bot

```bash
docker run -e API_KEY=... -e MY_ID=... -e PHOTO_CHAT_ID=... -e VIDEO_CHAT_ID=... media-mover-bot
```

### Multiple Bots with Compose

```bash
# Prepare env files
cp .env.example .env.1
cp .env.example .env.2
# Edit each file with different values

# Deploy
./compose.sh
```

## Bot Commands

### /my_id

Returns your Telegram user ID. Useful for:
- Finding your `MY_ID` for configuration
- Debugging authorization issues

### /chat_id

Returns the current chat's ID and type. Useful for:
- Finding `PHOTO_CHAT_ID` and `VIDEO_CHAT_ID` values
- Verifying bot is in the correct chats

## Media Handling

### Single Media

Send individual photos, videos, or GIFs directly to the bot. They'll be forwarded to the appropriate chat.

### Albums (Media Groups)

Send 2-10 media items as a Telegram album. The bot:
1. Collects all items
2. Waits 1 second for more items
3. Separates photos from videos
4. Sends each type as an album to its destination
5. Deletes original messages

### Mixed Albums

Albums containing both photos and videos:
- Photos → `PHOTO_CHAT_ID`
- Videos/Animations → `VIDEO_CHAT_ID`
- Order preserved within each type

## Notifications

The bot logs when:
- Added to a group chat
- Removed from a group chat
- Started in a private chat

These logs include chat ID, chat title, and who performed the action.
