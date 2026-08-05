# media-mover-telegram-bot

Simple bot created for moving photos and videos across two chats.
Suppose you have 2 telegram groups. You save photos in first group and videos in second.

It can be a little tiresome to do that by hand and this bot is helping to resolve the issue.

When you send photos or videos or even albums containing both,
bot will forward it to your groups accordingly.

The bot can successfully handle albums, so that UI in Telegram seems flawless.


## Features

- **Photo/Video Separation** - Automatically routes media to the right chat
- **Album Support** - Preserves Telegram's album UI when forwarding grouped media
- **Mixed Albums** - Splits albums containing both photos and videos, sending each type separately
- **Rate Limiting** - Built-in throttling to prevent Telegram API limits
- **Multi-Bot Deployment** - Run multiple instances with different configurations

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Run in development mode
npm run dev
```

## Configuration

See [docs/configuration/](docs/configuration/) for environment variables.

### Required Variables

| Variable | Description |
|----------|-------------|
| `API_KEY` | Telegram Bot API token |
| `MY_ID` | Your Telegram user ID |
| `PHOTO_CHAT_ID` | Destination chat for photos |
| `VIDEO_CHAT_ID` | Destination chat for videos |

## Documentation

- [Architecture](docs/architecture/) - Module responsibilities and data flow
- [Configuration](docs/configuration/) - Environment setup
- [Guides](docs/guides/) - Usage and deployment guides
