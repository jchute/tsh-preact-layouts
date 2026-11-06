# tsh-preact-layouts

![License: MIT](https://img.shields.io/badge/license-MIT-green) ![Preact](https://img.shields.io/badge/Preact-10-673ab8) ![Vite](https://img.shields.io/badge/Vite-6-646cff)

Custom stream overlays for [TournamentStreamHelper](https://github.com/joaorb64/TournamentStreamHelper) (TSH), built with [Preact](https://preactjs.com/) and [Vite](https://vite.dev/).

Drop a component into `src/Layouts`, and it becomes a page you can add to OBS, or any streaming tool, as a browser source. Small, ready-made components (`<DisplayName />`, `<Score />`, `<CharacterImage />`...) read TSH's live data for you, so you can focus on markup and styling while building layouts.

```jsx
import { Screen } from "@Components/Elements/Screen";
import { DisplayName, RoundName, Score } from "@Components/TSH";

export const Hello = () => (
  <Screen>
    <RoundName />
    <DisplayName team={1} /> <Score team={1} />
    <DisplayName team={2} /> <Score team={2} />
  </Screen>
);
```

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Page scope and URL parameters](#page-scope-and-url-parameters)
- [TSH's scoreboard vs. this project's scoreboards](#tshs-scoreboard-vs-this-projects-scoreboards)
- [Included layouts](#included-layouts)
- [Creating a layout](#creating-a-layout)
- [Feature catalog](#feature-catalog)
- [Component reference](#component-reference)
- [Quick start examples](#quick-start-examples)
- [Tips and tricks](#tips-and-tricks)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Drop-in layouts.** Add `src/Layouts/Name.jsx` or `src/Layouts/Name/index.jsx` and it is discovered automatically. No index file or router to maintain.
- **One HTML page per layout.** `npm run build` emits `build/Name.html` for every layout, ready for an OBS browser source.
- **Live TSH data.** The app polls TSH's `program_state.json` and re-renders when it changes, backing off automatically when TSH is unreachable.
- **100+ data components.** Players, teams, characters, round info, stage strike, bracket, head-to-head history, queued sets, team battle, tournament info and more.
- **Scoped props.** Choose which scoreboard, team or player a whole section reads once, with `<Scope>`, URL parameters or `data-*` attributes.
- **Build your own fields.** Four small factories turn any selector into a text field, image field, list or condition.
- **19 example layouts** covering scoreboards, cams, stage select, brackets, intermission screens and more.
- **SCSS modules, path aliases, ESLint, Stylelint and Prettier** already configured.

## Requirements

- [TournamentStreamHelper](https://github.com/joaorb64/TournamentStreamHelper) installed and running.
- [Node.js](https://nodejs.org/) 20 or newer, with npm (developed on Node 22).
- A static web server for the build output (see [Usage](#usage)).

## Installation

This repo is meant to live **directly inside the TSH folder**, next to TSH's `out` folder.

```sh
cd path/to/TournamentStreamHelper
git clone https://github.com/jchute/tsh-preact-layouts.git
cd tsh-preact-layouts
npm install
```

You should end up with this layout:

```text
TournamentStreamHelper/              <- TSH root (your web server's root)
├── out/
│   └── program_state.json           <- the live data TSH writes
└── tsh-preact-layouts/              <- this repo
    ├── settings.json
    ├── src/
    └── build/                       <- created by `npm run build`
```

Then set up [`settings.json`](#configuration) and run `npm run dev`.

## Configuration

Settings live in [`settings.json`](settings.json) at the project root. Anything you leave out falls back to the defaults in [`src/State/settings.js`](src/State/settings.js), and nested objects are merged key by key.

```json
{
  "data_path": {
    "dev": "http://localhost:5000/out/program_state.json",
    "build": "../../out/program_state.json"
  },
  "dev": {
    "showDevBackground": true
  }
}
```

| Setting                 | Default                        | Description                                                                                                      |
| ----------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `data_path.dev`         | `../../out/program_state.json` | Where `npm run dev` reads TSH's data. Must be a **full URL** to TSH's built-in web server (see below).           |
| `data_path.build`       | `../../out/program_state.json` | Where built pages read TSH's data. A path **relative to the built HTML page**.                                   |
| `dev.showDevBackground` | `true`                         | Shows a checkerboard behind the layout in dev, so transparent overlays are easy to see. Has no effect on builds. |

### Dev data path

TSH keeps its data in the `out` folder at the TSH root. The Vite dev server is rooted at this project's `src` folder, so it cannot reach that folder with a relative path. Instead, point `data_path.dev` at TSH's own web server, which serves the TSH root:

```json
{
  "data_path": {
    "dev": "http://localhost:5000/out/program_state.json"
  }
}
```

- TSH must be running for this URL to respond. Change the port if your TSH uses a different one.
- The dev page (`http://localhost:5173`) and TSH's server are different origins, so the browser needs the server to allow cross-origin requests (CORS). If the console shows a CORS error, see [Troubleshooting](#troubleshooting).
- No restart needed after editing `settings.json`: reload the page and the new values are used.

### Build data path

Because this repo sits in the TSH folder, a built page at `tsh-preact-layouts/build/Name.html` can reach TSH's data with the relative path `../../out/program_state.json`:

```text
TournamentStreamHelper/tsh-preact-layouts/build/Name.html
                       └── ../../ ─────────────┘
TournamentStreamHelper/out/program_state.json
```

This works when your web server's root is the **TSH root folder**. The default already matches, so you normally leave `data_path.build` alone.

### Good to know

- `npm run build` copies `settings.json` to `build/settings.json`. If you change settings later, rebuild, or edit the copy inside `build/`.
- TSH's asset paths (flags, character icons, logos) are resolved from the folder **above** the data file. The data path must therefore point into TSH's `out` folder, or images will not load.
- If `settings.json` is missing or invalid, the defaults are used and an error is logged to the console.

## Usage

### Scripts

| Command           | What it does                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite dev server with hot reload.                                                             |
| `npm run build`   | Builds to `tsh-preact-layouts/build/`, one HTML page per layout.                                        |
| `npm run preview` | Serves the build with Vite. Relative data paths will not reach TSH, so use your own web server instead. |
| `npm run lint`    | Runs ESLint and Stylelint.                                                                              |
| `npm run format`  | Formats the project with Prettier.                                                                      |

### Developing

1. Start TSH.
2. Run `npm run dev`.
3. Open `http://localhost:5173/?layout=MinimalScoreboard`, using any layout name from `src/Layouts`.

If `?layout=` is missing or wrong, a notice lists every available layout with links. Adding or removing a layout while the dev server is running reloads the page automatically.

### Building and using in OBS

1. Run `npm run build`. A table of generated pages is printed, one per layout.
2. Serve the **TSH root folder** with your web server.
3. In OBS, add a **Browser** source:
   - URL: `http://localhost:<port>/tsh-preact-layouts/build/MinimalScoreboard.html`
   - Width `1920`, height `1080`
4. After rebuilding, right-click the source and choose **Refresh cache of current page**.

`build/index.html?layout=Game` is the same page as `build/Game.html`. The generated pages just have the layout name baked in, so you can use whichever you prefer.

## Page scope and URL parameters

Components pick which item to read (which team, which player...) from props. Anything a component doesn't set is resolved in this order, highest priority first:

1. The component's own prop, e.g. `<Score team={2} />`
2. The nearest `<Scope>`, e.g. `<Scope team={2}>...</Scope>`
3. A URL parameter, e.g. `?team=2`
4. A `data-*` attribute on `#app`, e.g. `<div id="app" data-team="2">`
5. The default (1 for every indexed item)

URL parameters and data attributes are read once, for the whole page. Any key in the table below can be used, plus `layout`:

| Prop           | Default    | Picks                                                         |
| -------------- | ---------- | ------------------------------------------------------------- |
| `scoreboard`   | `1`        | Which TSH scoreboard to read.                                 |
| `team`         | `1`        | One side of the set (or a slot, depending on `source`).       |
| `player`       | `1`        | A player on the team.                                         |
| `commentator`  | `1`        | A commentator.                                                |
| `character`    | `1`        | One of a player's characters.                                 |
| `lastSet`      | `1`        | One of a team's earlier sets at this tournament (1 = newest). |
| `historyEntry` | `1`        | One of a team's past results (1 = newest).                    |
| `recentSet`    | `1`        | One of the head-to-head sets between the two teams.           |
| `completedSet` | `1`        | One of the sets completed at the tournament (1 = newest).     |
| `bracketRound` | `1`        | A bracket round.                                              |
| `bracketSet`   | `1`        | A set in a bracket round, top to bottom.                      |
| `bracketSide`  | `1`        | One side (1 or 2) of a bracket set.                           |
| `stage`        | `1`        | A stage in the ruleset.                                       |
| `game`         | `1`        | A game of the current set.                                    |
| `note`         | `1`        | One of TSH's note widgets.                                    |
| `queuedSet`    | `1`        | An upcoming set in a queue.                                   |
| `setMode`      | `"bestOf"` | Whether `<SetLength>` shows `"bestOf"` or `"firstTo"`.        |

Examples:

```text
http://localhost:5173/?layout=PlayerSpotlight&team=2
http://localhost:5173/?layout=DoublesScoreboard&scoreboard=2
http://localhost:5173/?layout=Intermission&screen=brb
```

> **Note:** All indexes start at 1, including the ones TSH itself starts at 0.
>
> Passing `null` (or an explicit `undefined`) for an indexed prop clears it, so it stops selecting an item inherited from the scope.

## Included layouts

Open any of these with `?layout=Name` in dev, or `build/Name.html` after a build.

| Layout              | What it shows                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `BracketView`       | Winners side across the top and losers below, each set with both players and scores.                             |
| `CamScoreboard`     | In-game overlay: compact scoreboard at the top center and a camera slot for each player in the bottom corners.   |
| `CommentaryDesk`    | One camera slot per caster with name, pronouns and Twitter handle (up to four).                                  |
| `CornerScoreboard`  | In-game overlay with each side on an angled plate in its own top corner and the score shown as game pips.        |
| `CrewBattle`        | Crew battle: both crews' fighters with counters, the active fighter highlighted and eliminated ones crossed out. |
| `DoublesScoreboard` | Scoreboard for doubles and bigger teams: a panel per team listing every player with their character.             |
| `Intermission`      | Starting soon, be right back and thanks for watching screens. Choose with `?screen=starting`, `brb` or `ending`. |
| `MinimalScoreboard` | Thin frosted strip at the top center with both sides, their scores and the round.                                |
| `PlayerCams`        | Between-games screen: both players' cameras side by side with name plates and scores.                            |
| `PlayerSpotlight`   | Spotlight on one player (`?team=1` by default) for introductions: stats, mains, controller and recent results.   |
| `QuadStream`        | Four TSH scoreboards in a 2x2 grid, each with a transparent stream slot and a basic scoreboard.                  |
| `ResultsTicker`     | Bar along the bottom scrolling through the most recent completed sets.                                           |
| `RivalryHistory`    | Head-to-head record and every previous meeting between the two players.                                          |
| `RoadToHere`        | Each player's previous sets at this tournament as a timeline, with W/L badges and opponents' characters.         |
| `SetTracker`        | One card per game of the set with the stage played and the winner. Needs TSH's game tracker turned on.           |
| `StageSelect`       | Every starter and counterpick stage in a grid, following TSH's stage strike.                                     |
| `UpNext`            | The start.gg stream queue as a list of upcoming sets with round, sides, set length and station.                  |
| `Versus`            | Full-screen versus splash with character art, names, seeds, records and head-to-head.                            |
| `Victory`           | Set winner screen with their character, the final score and who they beat.                                       |

Many layouts have constants at the top of the file (such as the image pack for character icons, or how many results to list) that are meant to be edited.

## Creating a layout

A layout is a top-level entry in `src/Layouts`:

- a file, e.g. `src/Layouts/Hello.jsx`, or
- a folder with an index file, e.g. `src/Layouts/Hello/index.jsx` (with `.jsx`, `.js`, `.tsx` or `.ts`).

The layout's name is the file or folder name. Rules:

- The component is chosen in this order: the **default export**, then the export **named after the layout**, then the **only exported component**. If none match, the page shows a notice (and `npm run build` warns).
- Names starting with `_` or `.`, or containing extra dots (`Game.test.jsx`), are ignored. Use `_Draft.jsx` to keep work in progress out of the build.
- If a folder and a file share a name, the folder wins.
- Layout names are case sensitive in the URL.

Next steps: see the [Quick start examples](#quick-start-examples).

## Feature catalog

### Layout discovery and build

- `virtual:layouts` is generated from `src/Layouts` (see [`plugins/layouts`](plugins/layouts)), so new layouts need no registration.
- A build emits one HTML file per layout and prints a summary table with its status.
- The build warns when a layout may not render, because it has no usable component export.
- `LayoutNotice` explains missing layouts, lists the available ones and shows how the page was requested.

### Live TSH data

- Polls `program_state.json` every 64 ms, backing off up to 2 s while requests fail, and recovers on its own.
- Only re-renders when TSH's `timestamp` increases, and quietly retries when TSH is mid-write.
- Nothing renders until the first payload arrives.
- `useTSH()` returns the full payload anywhere in a layout.
- A `tsh_update` event with `{ data, oldData }` is fired on `document` for every update, handy for animations.
- `resolveAsset(path)` turns TSH's relative asset paths into full URLs.

### The four component kinds

Every TSH component is made by one of the factories in [`createField.jsx`](src/Components/TSH/createField.jsx):

| Kind          | Behavior                                                          | Extra props                                           |
| ------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| **Text**      | Shows a value as a `<span>`.                                      | `className`, `fallback`, `format`, `hide`             |
| **Image**     | Shows an image URL as an `<img>`.                                 | `className`, `alt`, `width`, `height`, `fill`, `hide` |
| **List**      | Calls its children function once per item, with the item's index. | `limit`                                               |
| **Condition** | Renders its children only when a value is truthy.                 | `not` (invert)                                        |

- `fallback` is shown when the value is empty, and `format` only runs when it isn't.
- `hide` removes the element entirely when it would be empty.
- Images default to `1em` square, and `width`/`height` fill in for each other.
- Images fit inside their box by default. Add `fill` to make the image fill the box, clipping any edges that don't fit.
- List children **must be a function**: `<Players>{(player) => ...}</Players>`.

### Common props

Besides the [scope props](#page-scope-and-url-parameters), many components share these:

| Prop                                                                            | Used by                          | Meaning                                                                                                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `source`                                                                        | Team and person components       | Read a team from `"scoreboard"` (default), `"playerList"`, `"bracket"`, `"teamBattle"` or `"queuedSet"`. Use `"commentary"` on person components for commentators. |
| `queue`, `stream`                                                               | Queued set components            | `queue="stream"` reads the start.gg stream queue instead of the station queue. `stream` picks a stream by name.                                                    |
| `romanized`                                                                     | Name components                  | Prefer Latin-script names where TSH has them.                                                                                                                      |
| `locale`                                                                        | Names, dates                     | Language, e.g. `"fr"`, `"pt-BR"` for names or `"en-US"` for dates.                                                                                                 |
| `main`                                                                          | Character components             | Show a person's usual mains instead of what they're playing now.                                                                                                   |
| `opponent`                                                                      | Character, last set components   | Show the other side.                                                                                                                                               |
| `loser`                                                                         | Completed set components         | Show the loser instead of the winner.                                                                                                                              |
| `losers`                                                                        | Bracket components               | Use the losers side of the bracket.                                                                                                                                |
| `counterpick`, `all`, `selected`                                                | Stage components                 | Use the counterpick list, starters plus counterpicks, or the stage picked in the stage strike.                                                                     |
| `asset`                                                                         | `CharacterImage`                 | Which TSH image pack to use, e.g. `"base_files/icon"`.                                                                                                             |
| `scoreSeparator`, `recordSeparator`, `sponsorSeparator`, `playerNamesSeparator` | Joined text                      | Text placed between the joined values.                                                                                                                             |
| `setLengthTextVariant`                                                          | `BestOf`, `FirstTo`, `SetLength` | `"number"` (5), `"text"` ("Best of 5") or `"short"` ("BO5").                                                                                                       |

### Elements

- **`Screen`**: the root wrapper of a layout. A full-width 16:9 padded grid. Props: `className`, `gutter` (gap, default `1vw`) and `padding` (default `1vw`). Everything scales with the page width, so use `vw` or `em` units to scale with it.
- **`Text`** and **`Image`**: the building blocks behind every text and image field. Use them directly for your own values.

### Selectors and custom fields

- **Selectors** (in [`@State/selectors`](src/State/selectors)) are `(tsh, props) => value` functions that find objects such as a team, a player or the scoreboard. Examples: `getTeam`, `getPerson`, `getScoreboard`, `getCharacter`, `getBracketSet`, `getQueuedSet`.
- **`useSelector(select, props)`** runs a selector against live data, with scope resolved.
- **`useTeam(props)`** returns a team's raw data, e.g. its color.
- **`createTextField`, `createImageField`, `createKeyField`, `createList`, `createCondition`** build your own components. See [Quick start examples](#quick-start-examples).

### Utilities

- `cx(...classes)`: joins class names, ignoring falsy values.
- `isEmpty(value)`: true for `undefined`, `null` and `""`.
- `ordinal(1)` returns `"1st"`. Use it as `format={ordinal}`.
- `formatDate(date, locale)`: formats TSH timestamps and date strings, e.g. "October 3, 2026".
- `joinScores(scores, separator)`: joins scores, or returns `undefined` if one is missing.
- `SCORE_SEPARATOR` (`" - "`), `SPONSOR_SEPARATOR` (`" | "`), `NAME_SEPARATOR` (`" / "`).

### Styling

- Style layouts with SCSS modules next to the component, e.g. `hello.module.scss`.
- Global styles live in [`src/Assets/Scss`](src/Assets/Scss): reset and typography in `Generic`, colors and fonts in `Settings`, functions and mixins in `Tools`.
- The page background is transparent so OBS shows through.
- TSH stores each team's color. Read it with `useTeam({ team })?.color` and pass it as a CSS variable (`style={{ "--team-color": color }}`) to use it in SCSS.

### Path aliases

| Alias         | Folder           |
| ------------- | ---------------- |
| `@Assets`     | `src/Assets`     |
| `@Components` | `src/Components` |
| `@Layouts`    | `src/Layouts`    |
| `@Notices`    | `src/Notices`    |
| `@State`      | `src/State`      |
| `@Utils`      | `src/Utils`      |

## Component reference

Everything below is exported from `@Components/TSH`. Components that show one value accept the props of their kind (see [the four component kinds](#the-four-component-kinds)).

### Team

Takes `team` (default 1) and `source`.

| Component         | Shows                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------- |
| `Teams`           | List of teams in a source, passing the `team` index.                                    |
| `DisplayName`     | Main name: a single player's gamertag, or the team name (falling back to player names). |
| `DisplayTag`      | Second line for `DisplayName`: the sponsor, or the player names when a team has a name. |
| `TeamName`        | The team name typed into TSH.                                                           |
| `PlayerNames`     | Every player's gamertag, e.g. "Jonch / Stag".                                           |
| `Score`           | Games won in the set (0 before any).                                                    |
| `TeamLogo`        | The team's logo.                                                                        |
| `LosersIndicator` | "[L]" when the team is in losers.                                                       |
| `MergedTeamName`  | TSH's team name with the losers indicator.                                              |
| `Side`            | Grand finals side: "L" or "W".                                                          |
| `WinRatio`        | Share of games won so far in the set, e.g. "66.67%".                                    |
| `IfSingles`       | Condition: the team is a single player (`not` for teams of 2+).                         |
| `IfLosers`        | Condition: the team is marked as coming from losers.                                    |
| `useTeam(props)`  | Hook returning the team's raw data.                                                     |

### Person

Takes `team`, `player` (both default 1) and `source`. Use `source="commentary"` with `commentator` for commentators.

| Component                                   | Shows                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Players`, `Commentators`                   | Lists, passing the `player` or `commentator` index. Empty slots are skipped.                            |
| `Gamertag`, `Sponsor`, `MergedName`         | Name, sponsor, and "Sponsor \| Name". Take `romanized`.                                                 |
| `RealName`, `Pronoun`, `Twitter`, `City`    | Profile details.                                                                                        |
| `CustomText`                                | The player's custom text field in TSH.                                                                  |
| `Seed`                                      | Seed. Empty when unseeded.                                                                              |
| `Wins`, `Losses`, `WinPercentage`           | Set record at this tournament.                                                                          |
| `Record`                                    | "11 - 2" style record. Takes `recordSeparator`.                                                         |
| `Avatar`                                    | Profile picture.                                                                                        |
| `SponsorLogo`                               | Logo from TSH's `user_data/sponsor_logo` folder.                                                        |
| `Country`, `CountryFlag`                    | Country text (`countryVariant`: `name`, `code`, `emoji`, `display_name`) and flag.                      |
| `State`, `StateFlag`                        | State or region text (`stateVariant`: `name`, `code`) and flag.                                         |
| `Controller`, `ControllerIcon`              | Controller text (`controllerVariant`) and icon (`controllerIconVariant`: `simple`, `full`, `category`). |
| `IfRomanized`                               | Condition: a different romanized gamertag exists.                                                       |
| `IfBirthday`                                | Condition: it is the person's birthday.                                                                 |
| `IfActive`, `IfEliminated`, `BattleCounter` | Team battle: the active player, eliminated players and a player's counter.                              |

### Characters

Takes `character` (default 1) plus the person props. Add `main` for usual mains, or use `lastSet` / `recentSet` with `opponent`.

| Component          | Shows                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| `Characters`       | List of characters, passing the `character` index. Empty slots skipped. |
| `CharacterName`    | The character's name. Takes `locale`.                                   |
| `CharacterVariant` | The variant, for games that track one. Takes `locale`.                  |
| `CharacterImage`   | The character's image for the selected skin. Set `asset`.               |
| `CharacterSkin`    | TSH's skin number, starting at 0.                                       |

### Match (the current set)

Takes `scoreboard`.

| Component                             | Shows                                                         |
| ------------------------------------- | ------------------------------------------------------------- |
| `Match` / `RoundName`                 | The round, e.g. "Losers Quarter-Final".                       |
| `RoundNumber`                         | The round as a number.                                        |
| `Phase`, `PhaseGroups`, `PhaseSize`   | Bracket phase, number of pools and number of entrants.        |
| `BestOf`, `FirstTo`                   | Set length: 5, "Best of 5" or "BO5" (`setLengthTextVariant`). |
| `SetLength`                           | Either of the above, chosen by `setMode`.                     |
| `SetScore`                            | Both teams' scores, e.g. "2 - 1". Takes `scoreSeparator`.     |
| `Station`, `StreamUrl`, `UpsetFactor` | Setup, stream link and upset factor.                          |
| `BracketType`                         | Bracket format, e.g. "DOUBLE_ELIMINATION".                    |

### Games (needs TSH's game tracker)

Takes `game`. Show each game's stage with `<StageName game={n} />`.

| Component                   | Shows                                                     |
| --------------------------- | --------------------------------------------------------- |
| `Games`                     | List of games the set can last, passing the `game` index. |
| `GameWinner`                | The winning team: 1 or 2.                                 |
| `IfGameWon`                 | Condition: `team` won the game.                           |
| `IfGameTie`, `IfGamePlayed` | Conditions: the game was a tie, or has a result.          |

### Stages and stage strike

Takes `stage` plus `counterpick` or `all`, or `game`, or `selected`.

| Component                                                   | Shows                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `RulesetName`                                               | The ruleset's name.                                                       |
| `Stages`                                                    | List of the ruleset's stages, passing the `stage` index.                  |
| `StageName`                                                 | The stage's name. Takes `locale`.                                         |
| `StageImage`                                                | The stage's image.                                                        |
| `IfStageStruck`, `StageStruckBy`                            | Whether a stage is struck, and by which team.                             |
| `IfStageBanned`                                             | Condition: banned by DSR or modified DSR.                                 |
| `IfStageSelected`                                           | Condition: the stage picked for the current game.                         |
| `StageStrikeGame`, `StageStrikeTurn`                        | The game being struck for, and whose turn it is.                          |
| `IfStageStrikeTurn`, `IfStageStrikePicking`, `IfGentlemans` | Conditions: `team`'s turn, picking (not striking), gentleman's agreement. |

### Last sets (a team's run through the bracket)

Takes `team` and `lastSet` (1 = newest).

`LastSets`, `LastSetName`, `LastSetSponsor`, `LastSetSeed` (these three take `opponent`), `LastSetPhase`, `LastSetRound`, `LastSetResult` ("W" or "L"), `LastSetScore`.

### Recent sets (head-to-head between the current teams)

Takes `recentSet` and `team` (whose point of view).

`RecentSets`, `IfRecentSetsLoading`, `HeadToHead`, `RecentSetTournament`, `RecentSetEvent`, `RecentSetPhase`, `RecentSetRound`, `RecentSetDate`, `RecentSetResult`, `RecentSetScore`, `IfRecentSetOnline`.

### History (a team's past results)

Takes `team` and `historyEntry` (1 = newest).

`History`, `HistoryTournament`, `HistoryEvent`, `HistoryPlacement` (pair with `format={ordinal}`), `HistoryEntrants`, `HistoryDate`, `HistoryImage`.

### Completed sets (e.g. a results ticker)

Takes `completedSet` (1 = newest). Add `loser` for the losing side.

`CompletedSets`, `CompletedSetName`, `CompletedSetPlayerNames`, `CompletedSetSeed`, `CompletedSetPhase`, `CompletedSetRound`, `CompletedSetScore`.

### Queued sets (upcoming sets)

Takes `queuedSet` (1 = next). Use `queue="stream"` for the start.gg stream queue. Show each side with `source="queuedSet"`.

`QueuedSets`, `QueuedSetRound`, `QueuedSetPhase`, `QueuedSetBestOf`, `QueuedSetStation`.

### Bracket

Takes `bracketRound`, `bracketSet`, `bracketSide` and `losers`. Show a side's player details with `source="bracket"` and `team={slot}`.

`BracketPhase`, `BracketPhaseGroup`, `BracketRounds`, `BracketRoundName`, `BracketSets`, `BracketSetName`, `BracketSetScore`, `BracketSetSlot`, `IfBracketSetCompleted`, and the `useBracketSetSlot(props)` hook.

### Team battle (crew battle)

Show teams and players with `source="teamBattle"`.

`TeamBattleMode`, `TeamBattleRoundName`, `TeamBattlePhase`, `TeamBattleScore`, `TeamBattleCounterTotal`, plus the person components `IfActive`, `IfEliminated` and `BattleCounter`.

### Tournament

`TournamentName`, `TournamentAddress`, `TournamentEntrants`, `TournamentShortLink`, `TournamentStart`, `TournamentEnd`, `EventName`, `EventStart`, `EventEnd`, `VideogameName`, `VideogameLogo`, `NoteTitle`, `NoteContents`. Date components take `locale`, and note components take `note`.

### Helpers

`Scope`, `If`, `useTSH`, `useTeam`, `useBracketSetSlot`, and the factories `createTextField`, `createImageField`, `createKeyField`, `createList` and `createCondition`. `useSelector` is imported from `@Components/TSH/createField`.

## Quick start examples

### 1. The smallest scoreboard

`src/Layouts/Hello.jsx`:

```jsx
import { Screen } from "@Components/Elements/Screen";
import { DisplayName, RoundName, Score } from "@Components/TSH";

export const Hello = () => (
  <Screen>
    <RoundName hide />
    <div>
      <DisplayName team={1} /> <Score team={1} />
    </div>
    <div>
      <DisplayName team={2} /> <Score team={2} />
    </div>
  </Screen>
);
```

Open `http://localhost:5173/?layout=Hello`. The layout is picked up automatically.

### 2. Add some style with an SCSS module

`src/Layouts/Hello/index.jsx` (move the file into a folder):

```jsx
import styles from "./hello.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { DisplayName, RoundName, Score, useTeam } from "@Components/TSH";

const Side = ({ team }) => {
  const color = useTeam({ team })?.color;

  return (
    <div className={styles.side} style={{ "--team-color": color }}>
      <DisplayName className={styles.name} team={team} />
      <Score className={styles.score} team={team} />
    </div>
  );
};

export const Hello = () => (
  <Screen className={styles.screen}>
    <div className={styles.bar}>
      <Side team={1} />
      <RoundName className={styles.round} hide />
      <Side team={2} />
    </div>
  </Screen>
);
```

`src/Layouts/Hello/hello.module.scss`:

```scss
.screen {
  align-items: start;
  justify-items: center;
}

.bar {
  align-items: center;
  background: rgb(0 0 0 / 70%);
  display: flex;
  font-size: 1.6vw;
  gap: 1em;
  padding: 0.5em 1em;
}

.side {
  border-bottom: 0.15em solid var(--team-color, white);
  display: flex;
  gap: 0.5em;
}

.score {
  font-weight: bold;
}

.round {
  opacity: 0.7;
}
```

### 3. Lists: character icons for a team

A list calls its children function once per item and passes the item's index. Pass the index back to the component as a prop.

```jsx
import { CharacterImage, Characters } from "@Components/TSH";

const CharacterIcons = ({ team }) => (
  <Characters team={team}>
    {(character) => (
      <CharacterImage asset="base_files/icon" character={character} height="2em" hide team={team} />
    )}
  </Characters>
);
```

Open a `<Scope>` when several props repeat:

```jsx
<Characters team={team}>
  {(character) => (
    <Scope character={character} team={team}>
      <CharacterImage asset="base_files/icon" height="2em" hide />
      <CharacterName />
    </Scope>
  )}
</Characters>
```

### 4. Commentators

```jsx
import { Commentators, Gamertag, Pronoun } from "@Components/TSH";

const Casters = () => (
  <ul>
    <Commentators>
      {(commentator) => (
        <li key={commentator}>
          <Gamertag commentator={commentator} source="commentary" />
          <Pronoun commentator={commentator} hide source="commentary" />
        </li>
      )}
    </Commentators>
  </ul>
);
```

### 5. Conditions, fallbacks and formatting

```jsx
import { DisplayName, IfLosers, IfRomanized, Gamertag, Seed } from "@Components/TSH";
import { ordinal } from "@Utils/format";

const Player = ({ team }) => (
  <div>
    <DisplayName team={team} />
    <IfLosers team={team}> [L]</IfLosers>
    <IfRomanized team={team}>
      {" "}
      (<Gamertag romanized team={team} />)
    </IfRomanized>
    <Seed fallback="Unseeded" format={ordinal} team={team} />
  </div>
);
```

- `fallback` replaces an empty value, `format` only runs on a real value.
- `<IfLosers not>` renders its children when the condition is false.

To drop a label or wrapper when data is missing, wrap it in `<If>`, which works with any text field, image field or list:

```jsx
import { Controller, ControllerIcon, If } from "@Components/TSH";

<If anyOf={[Controller, ControllerIcon]}>
  <h3>Controller</h3>
  <ControllerIcon hide />
  <Controller hide />
</If>;
```

- `of={Seed}` tests one field or list. `anyOf={[A, B]}` shows the children when at least one has something to show.
- `not` renders the children when nothing has content.
- `fallback` is rendered instead of the children when the condition isn't met, e.g. `<If of={History} fallback={<li>No results</li>}>`.
- A field has nothing to show when its value is `null`, `undefined` or `""` (`0` counts as a value). A list has nothing to show when it would render no items, so empty character slots don't count.
- Other props (`team`, `main`, ...) pick the data and apply to the children as well, like `<Scope>`.
- Keep `hide` on the fields inside, so an icon can show without a name.

### 6. Reuse scope with `<Scope>`

```jsx
import { Gamertag, Score, Scope } from "@Components/TSH";

// Everything inside reads scoreboard 2, team 1
<Scope scoreboard={2} team={1}>
  <Gamertag />
  <Score />
</Scope>;
```

### 7. Build your own field

Any value in the TSH payload can become a component with a selector:

```jsx
import { createCondition, createTextField } from "@Components/TSH";
import { getScoreboard, getTeam } from "@State/selectors";

// Shows "LOSERS" for a team that came from losers; with `hide`, nothing otherwise
export const LosersLabel = createTextField((tsh, props) => {
  return getTeam(tsh, props)?.losers ? "LOSERS" : undefined;
});

// Renders its children when the scoreboard has a station
export const IfStation = createCondition((tsh, props) => getScoreboard(tsh, props)?.station);
```

```jsx
import { Station } from "@Components/TSH";

<LosersLabel hide team={2} />
<IfStation>Station <Station /></IfStation>
```

To pull a value out in a component rather than build a field, use `useSelector` or `useTSH`:

```jsx
import { useSelector } from "@Components/TSH/createField";
import { useTSH } from "@Components/TSH";
import { getScoreboard } from "@State/selectors";

const Quadrant = ({ scoreboard }) => {
  // Only render when TSH actually has this scoreboard
  const exists = Boolean(useSelector(getScoreboard, { scoreboard }));
  const tsh = useTSH(); // The full program_state.json payload

  return exists ? <div>{tsh.timestamp}</div> : null;
};
```

### 8. React to updates

```js
document.addEventListener("tsh_update", (event) => {
  const { data, oldData } = event.detail;

  if (data.score?.[1]?.team?.[1]?.score !== oldData.score?.[1]?.team?.[1]?.score) {
    // Play a sound, trigger an animation...
  }
});
```

## Tips and tricks

- **Hide drafts.** Prefix a layout with `_` (`_Experiment.jsx`) to keep it out of the build.
- **Scope instead of repeating.** Wrap a section in `<Scope scoreboard={2} team={1}>` instead of passing the same props to every component.
- **One layout, many views.** Read `team` from the page scope and reuse a layout for either side: `?layout=PlayerSpotlight&team=2`.
- **Use `hide`.** It removes empty elements from the markup, so spacing and borders don't appear around missing data.
- **Pick the image pack yourself.** TSH doesn't list packs in the same order everywhere, so always pass `asset` to `CharacterImage` (check the packs your game provides in `out/program_state.json`).
- **Skins start at 0.** Use `<CharacterSkin format={(skin) => skin + 1} />` to number them from 1.
- **Other languages.** Names and dates take `locale`: `<CharacterName locale="fr" />`, `<TournamentStart locale="de-DE" />`.
- **Read teams from elsewhere.** `source="playerList"`, `"bracket"`, `"teamBattle"` and `"queuedSet"` let the same team and person components show data from other parts of TSH.
- **Transparent slots.** Leave a `div` empty and size it, then put your camera or game capture behind the browser source in OBS.
- **Check transparency.** Keep `dev.showDevBackground` on while developing, so you can see which areas are see-through.
- **Scale with the stream.** Size with `vw` or `em` rather than `px`, so the layout looks the same at any browser source resolution.
- **Make a quick copy.** Duplicate a similar layout from `src/Layouts` and rename the folder. The component's export name can stay the same or match the new name.
- **Check the data.** Open `out/program_state.json` in TSH to see exactly what is available. `useTSH()` gives you the same object.
- **Lint before building.** `npm run lint` catches both script and style mistakes.
- **Refresh OBS after a build.** Browser sources cache pages, so refresh them after rebuilding.

## Troubleshooting

| Problem                                  | Likely cause and fix                                                                                                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Layout not found" page                  | The `?layout=` name doesn't match a folder or file in `src/Layouts`. Names are case sensitive. The page lists the available layouts.                                          |
| "Layout could not be loaded" page        | The layout has no usable component. Add a default export, an export named after the layout, or export exactly one component.                                                  |
| Blank page                               | Nothing renders until the first TSH payload arrives. Check that TSH is running and that `data_path` is correct. The console shows `TSH polling error` while it can't connect. |
| Console says "No state file defined"     | `data_path.dev` or `data_path.build` in `settings.json` is empty.                                                                                                             |
| CORS error in dev                        | Dev (`localhost:5173`) is reading TSH from another origin. Make sure TSH's server allows it, or use a web server with CORS enabled that serves the TSH root.                  |
| 404 for `program_state.json` in a build  | The web server's root isn't the TSH root, or the repo isn't directly inside the TSH folder. The relative path `../../out/program_state.json` must resolve to TSH's `out`.     |
| Images (flags, icons, logos) are missing | Asset paths are resolved from the folder above the data file. Make sure `data_path` points at the file in TSH's `out` folder.                                                 |
| Settings changes don't apply to a build  | The build copied `settings.json`. Rebuild, or edit `build/settings.json`.                                                                                                     |
| A new layout doesn't show up             | The name starts with `_`, has extra dots, or is an unsupported file type. The terminal prints warnings for invalid layouts.                                                   |
| Data looks stale in OBS                  | Refresh the browser source's cache.                                                                                                                                           |

## Security notes

- **Exposure.** Serving the TSH root folder makes everything in it available to anyone who can reach the server, including `out/` and `user_data/`. Bind your web server to `localhost` (or a trusted network), and don't expose it to the internet.
- **CORS.** Only allow the origin you need (for example `http://localhost:5173`) rather than `*`, when you control the server.
- **No secrets here.** `settings.json` only holds paths. Don't put tokens or credentials in it, since it is copied into `build/` and served as-is.
- **Data you display.** Player fields such as real names and Twitter handles come from TSH. Only show what the players are comfortable with on stream.

## Project structure

```text
.
├── settings.json              Data paths and dev options
├── vite.config.js             Vite config, plugins and path aliases
├── plugins/
│   ├── layouts/               Layout discovery and per-layout HTML generation
│   │   ├── index.js
│   │   ├── virtualModule.js   Generates `virtual:layouts`
│   │   ├── htmlGenerator.js   Emits `build/<Layout>.html`
│   │   ├── node/              Scanning and logging (build time)
│   │   └── runtime/           Picks a layout's component (runs in the browser)
│   └── settings.js            Serves and emits `settings.json`
└── src/
    ├── index.html             HTML entry (`#app`)
    ├── main.jsx               Reads the URL, mounts the app
    ├── App.jsx                Renders the layout with live TSH data
    ├── Layouts/               Your layouts (one per file or folder)
    ├── Components/
    │   ├── Elements/          Screen, Text, Image
    │   ├── Navigation/        LayoutLink
    │   └── TSH/               Data components and the field factories
    ├── Notices/               Pages shown when a layout can't render
    ├── State/
    │   ├── tsh.js             Polling, `useTSH`, `resolveAsset`
    │   ├── scope.js           Page scope and scope resolution
    │   ├── settings.js        Loads `settings.json` with defaults
    │   └── selectors/         Functions that find data in `program_state.json`
    ├── Utils/                 `cx`, `isEmpty`, formatting helpers
    └── Assets/Scss/           Theme: reset, typography, colors, fonts
```

## Contributing

1. Create a branch and make your changes.
2. Run `npm run format` and `npm run lint`.
3. Run `npm run build` to make sure every layout still builds without warnings.
4. Open a pull request describing what changed.

Code style is enforced by [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/).

## License

[MIT](LICENSE)
