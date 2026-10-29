# Telegram Chat Viewer

A lightweight React app to view Telegram HTML and JSON exports locally, with rich formatting, media browsing, search and a Telegram-like UI.

> **Note:** This viewer runs entirely in your browser. No data is uploaded or sent anywhere.

## Features

- **Rich Message Rendering** — Renders Telegram exports (`messages.html` / `messages1.html`) with full formatting support (bold, italic, code blocks, spoilers, blockquotes)
- **HTML and JSON Imports** — Opens Telegram HTML export folders or JSON exports (`result.json`) with their associated media
- **Multi-Chat JSON Exports** — Choose a conversation from a dropdown when an export contains multiple chats, then switch and reload conversations from the chat title
- **Comprehensive Media Handling** — Photos, videos, GIFs, stickers, animations, files, locations, contacts, and voice messages
- **Global Media Viewer** — Fullscreen media browser with keyboard navigation and counter (X / Y)
- **Inline Playback** — Round-video playback and Telegram-style audio waveform for voice messages
- **Quote Preview** — Shows the actual quoted message content when available
- **Search** — Filter the open chat by message text or sender, or search across all chats of a multi-chat JSON export (results are paged, 200 at a time)

![Media Viewer](./screenshots/mediaview.png)
*Navigate through photos and videos with keyboard shortcuts*

![Voice Messages](./screenshots/atts.png)
*Play voice messages with the familiar Telegram waveform interface*

## Quick Start

**1. Install dependencies**

```powershell
npm install
```

**2. Start the dev server**

```powershell
npm run dev
```

Open the local server URL printed by Vite (usually `http://localhost:3000`) in your browser.

## How to Use

1. **Export your chat** from Telegram Desktop — Chat → More → Export Chat History. Choose HTML or JSON as the export format.
2. **Place the exported folder** somewhere accessible on your computer.
3. **Open the app** and choose the exported folder. HTML exports are read from `messages.html` or `messages1.html`; JSON exports are read from `result.json` with associated media files.
4. **Choose a conversation** from the dropdown if the JSON export contains multiple chats. A single-chat export opens automatically.
5. **Switch conversations** using the dropdown in the chat title; the selected conversation is reloaded from the export.
6. **Browse your messages** with full formatting and media support.
7. **Click media thumbnails** to open the global viewer and navigate with the left/right arrow keys or on-screen controls.
8. **Play voice messages** inline with the Telegram-style waveform UI.
9. **Search in a chat** with the "Search in this chat" field above the messages; it filters by message text and sender.
10. **Search all chats** (multi-chat JSON exports) from the chat selection screen, or via the "Search all chats" link above an open chat. Click a result to open that chat with the query applied; use "Show more" to load further results.

## Developer Notes

- Built with **React + Vite**, **Tailwind CSS**, and **highlight.js** for syntax highlighting
- Parser logic lives in `src/utils/parser.js` and returns message objects used by the renderer
- If you encounter dev-server errors, try removing `node_modules` and re-running `npm install`

## TODO

- [x] ~~Search through chat history by message content or sender~~
- [ ] Search by date
- [ ] Jump to the exact message from a global search result
- [ ] Enhanced filtering options
- [x] ~~Dark/light theme toggle~~

## Contributing

PRs are welcome! Please follow the existing code style and run the dev server locally to test changes before submitting.

## License

[MIT](./LICENSE.MD)
