# media-mover-telegram-bot

A Telegram bot that automatically separates photos and videos into dedicated chats.

## Project Structure

```
├── src/
│   ├── bot.ts                          # Bot entry point, registers handlers
│   ├── config.ts                       # Environment variable loading
│   ├── types.ts                        # TypeScript type definitions
│   ├── utils.ts                        # Utility functions
│   ├── MessagesController.ts           # Routes messages to appropriate handler
│   ├── SingleMessageController.ts      # Handles individual media messages
│   ├── MediaGroupController.ts         # Handles grouped media (albums)
│   ├── Throttler.ts                    # Rate limiting for API calls
│   └── controllers/
│       ├── index.ts                    # Controller exports
│       ├── CommandsController.ts       # /my_id and /chat_id commands
│       └── GroupChatNotificationController.ts  # Chat join notifications
├── dist/                               # Compiled JS output
├── compose.yaml                        # Docker Compose for multi-bot setup
├── compose.sh                          # Helper script for compose
├── Dockerfile                          # Container build definition
└── docs/                               # Documentation
```

## Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| `bot.ts` | Initializes bot, registers message/command handlers, enforces user ID check |
| `config.ts` | Loads and validates environment variables (API_KEY, MY_ID, chat IDs) |
| `types.ts` | Type definitions for entities and send methods |
| `utils.ts` | Message extraction, error logging, delay utility |
| `MessagesController.ts` | Routes incoming messages to single or group handlers based on `media_group_id` |
| `SingleMessageController.ts` | Sends individual photos/videos/animations to their destination chats |
| `MediaGroupController.ts` | Collects and sends grouped media (albums), separating photos from videos |
| `Throttler.ts` | Prevents Telegram API rate limit violations |
| `CommandsController.ts` | Handles `/my_id` and `/chat_id` commands |
| `GroupChatNotificationController.ts` | Logs and notifies when bot is added/removed from chats |

## Data Flow

1. **Incoming message** → `bot.ts` validates user ID
2. **Message type check** → Routes to `message:photo`, `message:video`, or `message:animation`
3. **MessagesController.handleMessages()** checks for `media_group_id`:
   - **No group ID** → `SingleMessageController.processSingleMessage()` sends one item
   - **Has group ID** → `MediaGroupController` collects items, waits 1s debounce, sends as album
4. **Destination selection**:
   - Photos → `PHOTO_CHAT_ID`
   - Videos/Animations → `VIDEO_CHAT_ID`
5. **After sending** → Original message deleted from user's chat

## Configuration

See `docs/configuration/` for environment variables and setup.

## Documentation

- [docs/architecture/](docs/architecture/) - Detailed module descriptions
- [docs/configuration/](docs/configuration/) - Environment setup
- [docs/guides/](docs/guides/) - Usage guides

## Common Tasks

- **Run locally**: `npm run dev` (compiles TS and starts bot)
- **Build**: `npm run compile`
- **Deploy to opi3b**: `./bot.sh deploy` (always use this for production deploys)
- **Compose locally**: `./bot.sh compose` (build and start Docker containers)
