# Architecture

Detailed module responsibilities and data flow.

## Modules

### bot.ts

Entry point for the Telegram bot. Responsibilities:
- Initializes the grammY Bot instance
- Configures `@grammyjs/auto-retry` for automatic rate limit and server error handling
- Uses `@grammyjs/runner` for concurrent update processing
- Registers message handlers for `photo`, `video`, and `animation`
- Enforces user ID check (only `MY_ID` can use the bot)
- Registers command handlers (`/my_id`, `/chat_id`)
- Handles chat join notifications
- Sets up global error handler
- Handles graceful shutdown (SIGINT/SIGTERM)

### config.ts

Environment variable loading using `dotenv` and `env-var`. Exports:
- `API_KEY` - Telegram Bot API token
- `MY_ID` - Authorized user's Telegram ID
- `PHOTO_CHAT_ID` - Destination chat for photos
- `VIDEO_CHAT_ID` - Destination chat for videos

### MessagesController.ts

Central message router. Responsibilities:
- Receives all media messages
- Checks for `media_group_id` to distinguish single vs grouped media
- For single messages → delegates to `SingleMessageController`
- For grouped messages → delegates to `MediaGroupController`
- Implements 1-second debounce for media groups

### SingleMessageController.ts

Handles individual media messages. Responsibilities:
- Sends photos to `PHOTO_CHAT_ID`
- Sends videos/animations to `VIDEO_CHAT_ID`
- Deletes original message after forwarding

### MediaGroupController.ts

Handles media groups (albums). Responsibilities:
- Collects `file_id` values from grouped messages
- Separates photos from videos in mixed groups
- Sends grouped media as Telegram albums
- Waits for debounce timeout before sending

### CommandsController.ts

Command handler. Handles:
- `/my_id` - Returns the user's Telegram ID
- `/chat_id` - Returns the current chat ID and type
- Registers bot commands with Telegram API

### GroupChatNotificationController.ts

Handles `my_chat_member` events. Logs when bot is:
- Added to a group chat
- Removed from a group chat
- Started in a private chat

### types.ts

TypeScript type definitions:
- `EntityType` - `"photo" | "video" | "animation"`
- `MediaGroupEntityType` - `"photo" | "video"` (no animations in groups)
- `MediaEntity` - Union type for photo/video data
- `SendMethodName` - Maps entity type to API method name

### utils.ts

Utility functions:
- `extractMessagePropertiesFromContext()` - Extracts media, message ID, and group ID
- `sendTextMessage()` - Sends text message to user
- `sendErrorLog()` - Formats and sends error details

## Data Flow

```
User sends media
       │
       ▼
  bot.ts (validates user ID)
       │
       ▼
  MessagesController.handleMessages()
       │
       ├── No media_group_id ──► SingleMessageController
       │                              │
       │                              ▼
       │                     Send to destination chat
       │                              │
       │                              ▼
       │                     Delete original message
       │
       └── Has media_group_id ──► MediaGroupController
                                       │
                                       ▼
                              Collect file_ids (1s debounce)
                                       │
                                       ▼
                              Separate photos & videos
                                       │
                                       ▼
                              Send as albums to destinations
                                       │
                                       ▼
                              Delete original messages
```

## Message Processing Flow

### Single Message

1. User sends one photo/video/animation
2. `bot.ts` checks if user ID matches `MY_ID`
3. Routes to `SingleMessageController.processSingleMessage()`
4. Extracts media entity and message ID from context
5. Determines destination based on media type
6. Sends media to destination chat via API
7. Deletes original message from user's chat

### Media Group

1. User sends 2-10 media items as album
2. Each item triggers `MessagesController.handleMessages()`
3. Items collected into `MediaGroupController` arrays
4. After 1 second with no new items, timeout fires
5. `MediaGroupController.processMediaGroup()` executes
6. Photos and videos separated into different arrays
7. Each array sent as album to respective destination
8. All original messages deleted from user's chat

### Mixed Media Groups

When a group contains both photos and videos:
1. All photos collected into `photoGroupIds` array
2. All videos collected into `videoGroupIds` array
3. Photos sent to `PHOTO_CHAT_ID` as album
4. Videos sent to `VIDEO_CHAT_ID` as album
5. Order preserved within each type group
