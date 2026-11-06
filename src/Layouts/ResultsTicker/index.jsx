import styles from "./results-ticker.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import {
  CompletedSetName,
  CompletedSetRound,
  CompletedSets,
  CompletedSetScore,
  Scope,
} from "@Components/TSH";
import { getCompletedSets } from "@State/selectors";

/** How many seconds each result spends on screen while scrolling. Raise it to slow the ticker. */
const SECONDS_PER_RESULT = 6;

/** How many of the most recent results to scroll through. */
const MAX_RESULTS = 12;

/**
 * Every completed set, as one run of the ticker.
 */
const Results = () => (
  <CompletedSets limit={MAX_RESULTS}>
    {(completedSet) => (
      <Scope completedSet={completedSet}>
        <div className={styles.result}>
          <CompletedSetRound className={styles.round} hide />
          <CompletedSetName className={styles.winner} />
          <CompletedSetScore className={styles.score} hide />
          <CompletedSetName className={styles.loser} loser />
        </div>
      </Scope>
    )}
  </CompletedSets>
);

/**
 * Results ticker: a bar along the bottom that scrolls through the most recent completed sets with
 * winner, score, loser and round. The run is shown twice so the scroll loops without a jump, and
 * the speed follows the number of results.
 */
export const ResultsTicker = () => {
  const count = Math.min(MAX_RESULTS, Object.keys(useSelector(getCompletedSets)).length);

  return (
    <Screen className={styles.screen} padding="0">
      <div className={styles.bar}>
        <span className={styles.label}>Results</span>
        <div className={styles.window}>
          {count === 0 ? (
            <span className={styles.empty}>No completed sets yet</span>
          ) : (
            <div
              className={styles.track}
              style={{ "--duration": `${count * SECONDS_PER_RESULT}s` }}
            >
              <div className={styles.run}>
                <Results />
              </div>
              <div aria-hidden="true" className={styles.run}>
                <Results />
              </div>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
};
