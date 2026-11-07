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
Trade offers stay in Move history with all terms and status changes. Recipients
accept or reject later; senders can cancel. Play continues while offers are open.

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

99 checks cover classic rules, 12 long seeded games, geometry, 2/3/4-seat rooms,
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
physical dice use a short 850 ms tumble with diminishing contacts, cube-aware floor
support and an exact final face. The tray uses plain felt and brushed brass with no
particles or glowing decoration. Rolls of 2 and 5 now show the correct top face.
Reduced-motion preferences shorten the effect. Houses, hotels and flags face their
own side of the board. Subdivided, double-sided flag cloth stays pinned to the pole
and flutters with a restrained traveling wave. Top view uses upright, wrapped labels on all four sides. Font
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
purchase undo. Additional animation checks cover all six dice faces, floor clearance
throughout the toss, tray bounds and pinned cloth deformation. Browser QA restored the supplied save, replayed 2+1 into the 550-unit
English Park hotel rent, tested purchase/refund/redecision, and checked the dense
board at 3840 × 2160 without horizontal overflow. Native WebGL lighting remains
unverified in this cloud browser; the same scene was checked in compatibility mode.

Interaction references reviewed: Tabletopia's dice and object-behavior help,
Tabletop Playground's dice interaction documentation, and Three.js physical
material documentation. No external dice service is required.


## Shared-table communication and connection recovery

Room requests have a 10-second deadline, automatic backoff and immediate refresh
when the tab becomes visible or the network returns. The connection banner shows
last sync time, a concrete error and Reconnect now. Opening a saved seat during
an outage keeps retrying rather than discarding the seat. Uncertain writes keep the same
request ID and block new writes until their acknowledgement or retry is resolved;
a missing response cannot cause a second roll. Unexpected backend exceptions are
logged and return 503, while rejected game actions remain 400/403/409.

Move history is grouped by action, player, round and device-local time (with a
full date in the time tooltip). Online event timestamps come from the server.
Rolls, arrival, debt shortfall, purchase prices, building/mortgage cash changes and
remaining cash have explicit details. Player and type filters plus text search narrow the timeline together; amounts
are searchable with or without comma separators.
Existing saves retain their untimed earlier entries rather than inventing times.
The newest 300 event records and 100 legacy text entries remain in saved state.

Room chat stores authenticated, timestamped messages in a separate D1 table.
The latest 100 messages are shown with player colors and unread badges. Messages
are plain text, capped at 500 characters and rate limited to eight per ten seconds.
Chat and voice do not increment game revisions or interfere with Undo/turns.

Table voice is opt-in WebRTC audio for the room's 2–4 seats, with Join voice,
Mute/Unmute, Deafen, Leave and speaking indicators. Microphone capture requests
48 kHz mono audio, echo cancellation, noise suppression and automatic gain; Opus
is preferred and the outgoing audio bitrate is capped at 64 kbps. Browser/device
support determines the settings actually applied. Audio is peer-to-peer and is
not recorded by the game. Signaling is authenticated, recipient/session scoped,
and expires after 60 seconds; presence expires after 35 seconds without heartbeat.
Polite/impolite negotiation handles simultaneous offers and early ICE candidates.

The default deployment uses public STUN and direct voice connections. There is
**no production TURN relay configured**, so restrictive NAT/firewalls may block
voice. Optional coturn-style credentials can be generated server-side by setting
`VOICE_TURN_URLS` (comma-separated turn:/turns: endpoints) and secret
`VOICE_TURN_SECRET` through Sites runtime environment settings. The secret stays
server-side; joining members receive one-hour HMAC credentials. A TURN service
may have its own hosting/bandwidth charges. Do not use shared public relay passwords.

Validation: 99 automated tests cover the rules and geometry plus recovery from
failed polling, lost write receipts, identity-preserving retries, persisted chat,
session-isolated signaling, expiry, generated TURN credentials, voice mute/leave,
offer collisions, early ICE, event grouping and legacy saves. Browser QA used two
independent seats for start/roll/buy/pass, both directions of room chat, unread
badges and player filtering. A stopped/restarted preview verified automatic
recovery without losing the turn or balances. Actual microphone quality across
two physical devices and restrictive-network relay traversal remain unverified.


## Persistent trade offers and board readability

Local saves and online room state retain `tradeOffers` records, including exact
cash/card amounts, offered deeds, the original mortgage state and recipient bank
fees, creation round/time and the complete status audit. Offers appear as clickable
cards in Move history, including closed offers. The recipient alone may accept or
reject online; the sender alone may cancel. Multiple offers can coexist (up to
eight open offers per sender). Proposals do not reserve assets or pause turns.
Acceptance revalidates current assets and cash; changed ownership, mortgage terms,
buildings, insufficient funds/cards, bankruptcy or game end mark affected offers
unavailable. Temporary card/auction/payment phases leave offers open for later.
Accepted/rejected/cancelled/unavailable offers cannot be used again. Requests use
the existing revision/CAS and idempotency checks. Old single pending room offers
migrate on read/write, with unknown creation times kept untimed.

History filters support player, action type and case-insensitive text search,
including property names, both trade participants, formatted/raw cash amounts and
offer status. No entries are deleted by filtering. Trade records remain readable
in JSON saves and after reconnecting. The sidebar links to pending offers without
opening an interrupting dialog.

Board prices now use dark green ink and a heavier, slightly larger print in the
4096px texture and HTML fallback. Ararat's two peaks use continuous indexed terrain
with irregular volcanic ridges and a shared jagged snow boundary; there is no
separate floating snow cone. Native WebGL lighting remains unverified in the cloud
browser; board and mountain appearance were checked using the geometry renderer.

Additional checks cover persistence across turns/saves, multiple offers, cancelled
and rejected histories, seat authority, idempotent acceptance, asset revalidation,
original mortgage fees, temporary phase blocking, legacy migration, combined search
filters and continuity at the mountain snow boundary.
