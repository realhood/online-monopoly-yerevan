# Yerevan Monopoly — The Pink City Edition

A Yerevan-themed classic property-trading game for 2–4 people. Play together on
one computer, or create an online room and join from separate browsers. Three.js
renders a perspective board, Armenian tokens, miniature landmarks and physical
dice in an inset tray below the title. Camera controls sit below the table.

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

64 checks cover classic rules, 12 long seeded games, geometry, 2/3/4-seat rooms,
seat authorization, chosen-dice rejection, duplicate and competing actions,
reconnect, expired rooms, trade consent, individual building claims and retries.
Browser QA used two independent tab sessions: lobby join, host start, shared dice,
turn handoff, purchase/ownership sync, remote trade acceptance and refresh recovery.
The cloud browser uses the geometry-based compatibility renderer; native WebGL
PBR lighting and performance remain unverified in that environment.

Three.js is MIT licensed; see `public/game/THREE-LICENSE.txt`. Bundled Manrope and
Cinzel fonts use SIL OFL. The board print texture is 4096px, with Ultra/Balanced
resolution options and a previously checked 3840 × 2160 layout.


## Movement, dice and Undo update

The supplied round-98 save exposed a frame-rate-dependent waypoint stall. Movement
now uses an absolute-time route with exact final anchors, including backwards
cards, START and direct jail transfers. A marker follows the active piece's actual
position. Import, resume and Undo snap to the saved spaces and cancel old routes.
The rules engine includes an optional presentation trace; version-1 saves stay
compatible. Decisions and updated balances appear after the arrival frame is drawn,
and obsolete asynchronous callbacks cannot reopen an earlier payment dialog.

Dice sit in a brass/tuff tray inside the board below YEREVAN MONOPOLY. Polished
physical dice levitate, spin, bounce and settle with a small particle flourish; the
visual animation always ends on the rules engine's roll. Reduced-motion preferences
shorten the effect. Houses, hotels and flags face their own side of the board; flags
flutter subtly. Top view uses upright, wrapped labels on all four sides. Font
loading triggers a texture refresh. The compatibility renderer caches stationary
architecture so densely developed boards do not need to repaint it every frame.

Local Undo keeps the last 20 actions in the current session. It restores cash,
deeds, cards, buildings and the pending decision exactly. History begins when a
game is loaded. Online Undo is limited to the owner's latest purchase, building
or mortgage/sale action, before any other mutation. Rolls, multi-player building
claims and accepted trades cannot be undone online. The server holds the private
undo snapshot; the public response contains only availability and a label.

Validation added all 160 tile/seat footprints, low-frame-rate movement (up to
5-second frame gaps), 40 repeated laps, backward/jail routes, marker alignment,
arrival-before-dialog ordering, stale callback cancellation, orientation and online
purchase undo. Browser QA restored the supplied save, replayed 2+1 into the 550-unit
English Park hotel rent, tested purchase/refund/redecision, and checked the dense
board at 3840 × 2160 without horizontal overflow. Native WebGL lighting remains
unverified in this cloud browser; the same scene was checked in compatibility mode.

Interaction references reviewed: Tabletopia's dice and object-behavior help,
Tabletop Playground's dice interaction documentation, and Three.js physical
material/particle examples. No external dice service is required.
