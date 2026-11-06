import styles from "./up-next.module.scss";
import { Screen } from "@Components/Elements/Screen";
import {
  CountryFlag,
  DisplayName,
  DisplayTag,
  EventName,
  If,
  QueuedSetBestOf,
  QueuedSetPhase,
  QueuedSetRound,
  QueuedSets,
  QueuedSetStation,
  Scope,
  TournamentName,
} from "@Components/TSH";
import { cx } from "@Utils/cx";

/** How many upcoming sets to list. */
const MAX_SETS = 6;

/**
 * One competitor in an upcoming set.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Right-align, for the second side.
 * @param {number} props.team Which side of the set (1 or 2).
 */
const Entrant = ({ flip = false, team }) => (
  <div className={cx(styles.entrant, flip && styles.flip)}>
    <CountryFlag height="1.1em" hide team={team} width="1.6em" />
    <div className={styles.names}>
      <DisplayTag className={styles.tag} hide team={team} />
      <DisplayName className={styles.name} fallback="TBD" team={team} />
    </div>
  </div>
);

/**
 * Up next: the start.gg stream queue as a list of upcoming sets with round, both sides, set length
 * and station. The first entry is called out, as the stream queue can include the set being played.
 */
export const UpNext = () => {
  return (
    <Screen className={styles.screen} padding="4vw">
      <header className={styles.header}>
        <h1 className={styles.title}>Up next</h1>
        <div className={styles.event}>
          <TournamentName hide />
          <EventName hide />
        </div>
      </header>

      <Scope queue="stream" source="queuedSet">
        <ol className={styles.list}>
          <QueuedSets limit={MAX_SETS}>
            {(queuedSet) => (
              <Scope queuedSet={queuedSet}>
                <li className={cx(styles.set, queuedSet === 1 && styles.first)}>
                  <span className={styles.position}>{queuedSet}</span>
                  <div className={styles.round}>
                    <QueuedSetRound hide />
                    <QueuedSetPhase className={styles.phase} hide />
                  </div>
                  <Entrant team={1} />
                  <span className={styles.vs}>vs</span>
                  <Entrant flip team={2} />
                  <div className={styles.info}>
                    <QueuedSetBestOf format={(length) => `Bo${length}`} hide />
                    <QueuedSetStation format={(station) => `Station ${station}`} hide />
                  </div>
                </li>
              </Scope>
            )}
          </QueuedSets>
        </ol>
      </Scope>

      <If not of={QueuedSets} queue="stream">
        <p className={styles.empty}>Nothing in the queue yet.</p>
      </If>
    </Screen>
  );
};
