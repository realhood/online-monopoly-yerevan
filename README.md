# Yerevan Monopoly — The Pink City Edition

A complete browser-local property trading game for 2–4 people sharing a computer.
Three.js 0.170.0 renders the board, cultural tokens, miniature city and dice. A canvas
top-view fallback keeps all game mechanics playable without WebGL.

## Play

Open the deployed site, choose 2–4 seats, enter names and start. The browser saves
after each completed action. The menu exports/imports JSON saves. The rulebook is
available inside the game.

For a standalone offline copy, open `dist/Yerevan-Monopoly-Offline.html` directly in
a desktop browser. The file embeds Three.js, game code and CSS and has no runtime
network dependencies. If local-file browser storage is unavailable, use save export.

## Rules

The balance follows modern classic Monopoly with fixed 200 income / 100 luxury tax,
using 1,000 Armenian dram per original game-money unit. The 40 spaces, 28 deeds,
32-card decks, 32 houses and 12 hotels follow the classic values. Rent collection,
debt, card chains and bankruptcy are automated. House/hotel shortages are enforced;
competing claims for the bank’s last building trigger an auction. Opening-roll ties
are rerolled. Auctions use sequential bidding with a permanent pass for that auction.
Mortgage interest rounds up to the next original game-money unit. Tradable mortgage
recipients choose immediate redemption or interest with continued mortgage.

Source: [Hasbro classic game instructions](https://instructions.hasbro.com/en-us/instruction/monopoly-board-game-classic-game-with-storage-tray-and-larger-tokens-family-games-8).
Armenian landmarks and events are original thematic adaptations. The metro names
replace the four railroad deeds for game balance; they are not a geographical route.
Unofficial fan-made game, not affiliated with Hasbro.

## Development

Buildless static site: `dist/index.html` with ES modules. There are no package dependencies.

```
npm test
node scripts/make-offline.mjs
```

34 rules checks include jail variants, doubles, deck conservation, chained cards,
even construction and liquidation, scarce building auctions, trade atomicity,
mortgage rounding and redemption, debt continuation, inheritance, bank auctions,
normal victory and 12 seeded long-game simulations.

Browser checks covered 4-player setup, save recovery with a pending purchase,
buying, mortgaging, trading, turn flow and the canvas fallback. The cloud test
browser disables WebGL, so hardware-accelerated 3D could not be visually verified.

Three.js is MIT licensed; see `dist/THREE-LICENSE.txt`.

## High-resolution interface update

The interface now uses live HTML board labels and SVG artwork instead of raster text.
All 40 names remain upright, keyboard-accessible, and independently scaled. The
board surface is a 4096px texture; canvas output follows device pixel ratio, with
Ultra and Balanced quality options. Bundled Manrope/Cinzel fonts also work offline.
The game fills desktop displays, including a checked 3840 × 2160 viewport with
18–27px board names and no horizontal overflow. New player cards, a persistent
landmark inspector, illustrated tokens, progress steps, legal-action hints and quick
auction bid controls improve play. Existing version-1 saves remain compatible.

The cloud browser still disables WebGL. The 4K layout, top-view fallback and UI
interactions were checked; hardware 3D visuals remain unverified in this environment.

## Board-first decisions and 3D ownership update

Buying decisions stay in the side panel after a roll. Players can inspect every
space, view title deeds, compare a color set, highlight a portfolio, manage assets
and return to the board before choosing Buy or Auction. Pending dialogs include a
Review the board action; hiding a dialog never ends a turn or accepts an action.

Owned deeds display the owner's name and token on a colored ribbon, alongside a
3D flag and a purchase confirmation. Physical apartment/hotel models have windows,
trim, owner-colored accents and separate heights. The city, beveled board tiles,
dice, materials and studio lighting have been rebuilt. A canvas compatibility
renderer projects the same Three.js scene when WebGL cannot start, so the 3D view
is usable in those browsers too.

Validation: 39 passing rules and geometry checks. Browser checks covered board
inspection during a pending buying decision, returning from the title deed, buying,
named ownership, purchase confirmation and portfolio highlighting. 3D scene
geometry was visually inspected using the compatibility renderer; WebGL-specific
lighting remains unverified in the cloud test browser.


## Perspective table and separate dice tray

The 3D table uses a perspective camera, drag-to-orbit, wheel zoom, rotation controls,
a top view, and reset. Tile names, prices, and ownership are printed into a 4096px
surface texture, so they rotate with the physical board. Keyboard-accessible deed
buttons remain available. The beveled board has a thicker base and miniature
Yerevan skyline. Dice occupy a separate physical tray outside the board; camera
buttons are below the table, and Roll stays in the side panel.

The compatibility renderer projects the texture in perspective with adaptive
resampling. Native WebGL retains PBR materials, environment reflections and
soft shadows. Browser QA covered two turns, rolling, buying, returning from a
pending deed, named ownership, rotation and top view. The 4K iframe check
confirmed 3840 × 2160 with no horizontal overflow and controls outside the
scene. The standalone bundled game was also opened successfully.
