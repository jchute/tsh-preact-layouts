import styles from "./intermission.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  DisplayName,
  EventName,
  NoteContents,
  NoteTitle,
  QueuedSetBestOf,
  QueuedSetRound,
  QueuedSets,
  Scope,
  TournamentAddress,
  TournamentName,
  TournamentShortLink,
  TournamentStart,
  VideogameLogo,
  VideogameName,
} from "@Components/TSH";

/**
 * The three screens this layout can show, picked with `?screen=starting|brb|ending`. Edit the
 * text here to change the wording.
 */
const SCREENS = {
  starting: { title: "Starting soon", subtitle: "The stream begins shortly" },
  brb: { title: "Be right back", subtitle: "We'll return in a few minutes" },
  ending: { title: "Thanks for watching", subtitle: "See you at the next one" },
};

/** The screen shown when `?screen=` is missing or not one of the above. */
const DEFAULT_SCREEN = "starting";

/**
 * Reads which screen to show from the page's URL.
 *
 * @returns {{ title: string, subtitle: string }} The screen's text.
 */
const readScreen = () => {
  const requested = new URLSearchParams(window.location.search).get("screen");

  return SCREENS[Object.hasOwn(SCREENS, requested) ? requested : DEFAULT_SCREEN];
};

/**
 * Intermission screen with three modes: starting soon, be right back and thanks for watching.
 * Choose with `?screen=starting`, `?screen=brb` or `?screen=ending`. It shows the tournament and
 * event, the TSH notes and the next set in the stream queue, over a slowly moving gradient.
 */
export const Intermission = () => {
  const { subtitle, title } = readScreen();

  return (
    <Screen className={styles.screen} gutter="2em" padding="4vw">
      <header className={styles.header}>
        <VideogameLogo className={styles.logo} height="4em" hide />
        <div>
          <TournamentName className={styles.tournament} />
          <div className={styles.event}>
            <EventName hide />
            <VideogameName hide />
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.lower}>
        <div className={styles.notes}>
          {[1, 2].map((note) => (
            <Scope key={note} note={note}>
              <div className={styles.note}>
                <NoteTitle className={styles.noteTitle} hide />
                <NoteContents className={styles.noteBody} hide />
              </div>
            </Scope>
          ))}
        </div>

        <Scope queue="stream" source="queuedSet">
          <QueuedSets limit={1}>
            {(queuedSet) => (
              <Scope queuedSet={queuedSet}>
                <div className={styles.next}>
                  <span className={styles.nextLabel}>Up next</span>
                  <div className={styles.nextPlayers}>
                    <DisplayName team={1} />
                    <span className={styles.nextVs}>vs</span>
                    <DisplayName team={2} />
                  </div>
                  <div className={styles.nextMeta}>
                    <QueuedSetRound hide />
                    <QueuedSetBestOf format={(length) => `Best of ${length}`} hide />
                  </div>
                </div>
              </Scope>
            )}
          </QueuedSets>
        </Scope>
      </div>

      <footer className={styles.footer}>
        <TournamentStart hide />
        <TournamentAddress hide />
        <TournamentShortLink hide />
      </footer>
    </Screen>
  );
};
