# Yerevan Monopoly — The Pink City Edition

A Yerevan-themed classic property-trading game for 2–4 people. Play together on
one computer, or create an online room and join from separate browsers. Three.js
renders a perspective board, Armenian tokens, miniature landmarks and physical
dice in a separate tray. Camera controls sit below the table.

## Play

Open the website and choose **Play online** to create or join a room. The host
shares an invite link or eight-character code and starts with 2–4 joined players.
Each device controls only its own seat. Dice, purchases, auctions, cards, jail,
building claims, mortgages, debt and bankruptcy synchronize through the server.
Trades are proposals: the recipient accepts or declines on their own device.

Room state persists for seven days after the last action. Refresh to reconnect;
a closed tab can rejoin through **Rejoin a saved seat** on the same browser.
Disconnected players retain their seats and the game waits for their action.
There is no automatic replacement, turn timeout, spectator mode or computer AI.
Invite codes allow a person to join an open seat before start; keep them among
your players. Once started, new seats cannot join. Internet access is required.

For one-computer play, choose 2–4 players and enter names. Browser saves and JSON
export/import continue to work independently of online rooms. The standalone
`public/game/Yerevan-Monopoly-Offline.html` embeds all game code, fonts and graphics.
Open it directly in a desktop browser. Online mode links to the hosted version.

## Rules

Classic values are multiplied by 1,000 and shown as Armenian dram. The 40 spaces,
28 deeds, two 16-card decks, 32 houses and 12 hotels follow the classic balance.
Income tax is 200 units and luxury tax 100; Free Parking has no jackpot. Rules
include doubles, jail, automatic rent, complete color sets, even development,
limited building supply, scarce-building auctions, liquidation, mortgages,
trade fees, debt and bankruptcy. Auctions use sequential bids with a permanent
pass for that auction. The in-game handbook explains every supported rule.

Landmarks and metro deeds are theme choices, not a geographical route. This is
an unofficial fan-made edition, not affiliated with Hasbro. Rule reference:
[Hasbro classic instructions](https://instructions.hasbro.com/en-us/instruction/monopoly-board-game-classic-game-with-storage-tray-and-larger-tokens-family-games-8).

## Implementation

- `public/game/`: original game, rules engine, Three.js assets and offline bundle.
- `app/route.ts`: full-screen game entry; `app/api/rooms/`: room endpoints.
- `lib/network-game.mjs`: authoritative engine, seat authorization, trade consent,
  per-player building claims, cryptographic dice, revision checks and idempotency.
- `public/game/network.js`: polling, reconnect, retries and browser seat storage.
- D1 `network_rooms`: versioned room snapshots; schema and migrations in `db/`
  and `drizzle/`. Seat secrets are hashed server-side and never included in game
  state. Future card order stays on the server. Competing writes use a conditional
  revision update; uncertain retries reuse the same action identifier.
- Vinext/Cloudflare Worker uses the maintained Sites build integration. Public
  access remains unchanged. There are no external game services or account setup.

```sh
npm test
node scripts/make-offline.mjs
npm run build
```

53 checks cover classic rules, 12 long seeded games, geometry, 2/3/4-seat rooms,
seat authorization, chosen-dice rejection, duplicate and competing actions,
reconnect, expired rooms, trade consent, individual building claims and retries.
Browser QA used two independent tab sessions: lobby join, host start, shared dice,
turn handoff, purchase/ownership sync, remote trade acceptance and refresh recovery.
The cloud browser uses the geometry-based compatibility renderer; native WebGL
PBR lighting and performance remain unverified in that environment.

Three.js is MIT licensed; see `public/game/THREE-LICENSE.txt`. Bundled Manrope and
Cinzel fonts use SIL OFL. The board print texture is 4096px, with Ultra/Balanced
resolution options and a previously checked 3840 × 2160 layout.
