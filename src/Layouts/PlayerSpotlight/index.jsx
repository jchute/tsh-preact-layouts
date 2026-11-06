import styles from "./player-spotlight.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  Avatar,
  CharacterImage,
  Characters,
  City,
  Controller,
  ControllerIcon,
  CountryFlag,
  DisplayName,
  DisplayTag,
  History,
  HistoryEvent,
  HistoryPlacement,
  HistoryTournament,
  Pronoun,
  RealName,
  Record,
  Scope,
  Seed,
  Twitter,
  useTeam,
  WinPercentage,
} from "@Components/TSH";
import { ordinal } from "@Utils/format";

/** Which TSH image pack to use for character icons. Check which packs your game provides. */
const ICON_ASSET = "base_files/icon";

/** How many past results to list. */
const MAX_HISTORY = 5;

/**
 * A labelled number or short text, hidden when TSH has no value for it.
 *
 * @param {object} props
 * @param {import("preact").ComponentType} props.as The TSH text component that supplies the value.
 * @param {string} props.label What the value is.
 */
const Stat = ({ as: Field, label }) => (
  <div className={styles.stat}>
    <Field className={styles.value} fallback="-" />
    <span className={styles.statLabel}>{label}</span>
  </div>
);

/**
 * Spotlight on a single player, for introductions or between sets. Shows `?team=1` by default;
 * add `?team=2` to the URL (or `data-team="2"` on #app) to show the other side. The transparent
 * square on the left is for the player's camera.
 */
export const PlayerSpotlight = () => {
  const color = useTeam()?.color;

  return (
    <Screen className={styles.screen} gutter="3em" padding="4vw">
      <div className={styles.card} style={{ "--team-color": color }}>
        <div className={styles.cam}>
          <Avatar className={styles.avatar} height="5em" hide />
        </div>

        <div className={styles.profile}>
          <header className={styles.header}>
            <DisplayTag className={styles.sponsor} hide />
            <DisplayName className={styles.name} />
            <div className={styles.meta}>
              <CountryFlag height="1.2em" hide width="1.8em" />
              <City hide />
              <Pronoun hide />
              <RealName hide />
              <Twitter format={(handle) => `@${String(handle).replace(/^@/, "")}`} hide />
            </div>
          </header>

          <div className={styles.stats}>
            <Stat as={Seed} label="Seed" />
            <Stat as={Record} label="Record" />
            <Stat as={WinPercentage} label="Win rate" />
          </div>

          <div className={styles.loadout}>
            <div className={styles.group}>
              <span className={styles.heading}>Mains</span>
              <div className={styles.icons}>
                <Characters main>
                  {(character) => (
                    <CharacterImage
                      asset={ICON_ASSET}
                      character={character}
                      height="2.6em"
                      hide
                      main
                    />
                  )}
                </Characters>
              </div>
            </div>
            <div className={styles.group}>
              <span className={styles.heading}>Controller</span>
              <div className={styles.controller}>
                <ControllerIcon height="2.4em" hide />
                <Controller hide />
              </div>
            </div>
          </div>

          <div className={styles.history}>
            <span className={styles.heading}>Recent results</span>
            <ol className={styles.results}>
              <History limit={MAX_HISTORY}>
                {(entry) => (
                  <Scope historyEntry={entry}>
                    <li className={styles.result}>
                      <HistoryPlacement className={styles.place} format={ordinal} />
                      <HistoryTournament className={styles.tournament} />
                      <HistoryEvent className={styles.event} hide />
                    </li>
                  </Scope>
                )}
              </History>
            </ol>
          </div>
        </div>
      </div>
    </Screen>
  );
};
