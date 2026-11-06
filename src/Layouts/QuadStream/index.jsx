import styles from "./quad-stream.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { useSelector } from "@Components/TSH/createField";
import { DisplayName, RoundName, Score, Scope, Station, useTeam } from "@Components/TSH";
import { getScoreboard } from "@State/selectors";
import { cx } from "@Utils/cx";

/** The TSH scoreboards shown, top left to bottom right. Each needs to be set up in TSH. */
const SCOREBOARDS = [1, 2, 3, 4];

/**
 * One side of a cell's scoreboard: name and score, tinted with the team color set in TSH.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the side, for the right-hand player.
 * @param {number} props.team Which side to show (1 or 2).
 */
const Contestant = ({ flip = false, team }) => {
  const color = useTeam({ team })?.color;

  return (
    <div
      className={cx(styles.contestant, team === 2 ? styles.two : styles.one, flip && styles.flip)}
      style={{ "--team-color": color }}
    >
      <DisplayName className={styles.name} team={team} />
      <Score className={styles.score} team={team} />
    </div>
  );
};

/**
 * One quadrant: a transparent slot for the stream feed with a small scoreboard under it. A
 * scoreboard TSH doesn't have is left as an empty slot.
 *
 * @param {object} props
 * @param {number} props.scoreboard Which TSH scoreboard to read.
 */
const Quadrant = ({ scoreboard }) => {
  const exists = Boolean(useSelector(getScoreboard, { scoreboard }));

  return (
    <Scope scoreboard={scoreboard}>
      <figure className={styles.quadrant}>
        {/* Transparent so the stream behind the browser source shows through */}
        <div className={styles.slot} />
        {exists && (
          <figcaption className={styles.board}>
            <Contestant team={1} />
            <div className={styles.info}>
              <RoundName className={styles.round} hide />
              <Station className={styles.station} format={(station) => `Station ${station}`} hide />
            </div>
            <Contestant flip team={2} />
          </figcaption>
        )}
      </figure>
    </Scope>
  );
};

/**
 * Quad stream screen: four TSH scoreboards in a 2x2 grid. Each quadrant has a transparent slot for
 * its stream and a basic scoreboard (names, scores, round and station) beneath it.
 *
 * Scoreboards 1 to 4 are used; change `SCOREBOARDS` to show others.
 */
export const QuadStream = () => {
  return (
    <Screen className={styles.screen} gutter="0.6vw" padding="0.6vw">
      {SCOREBOARDS.map((scoreboard) => (
        <Quadrant key={scoreboard} scoreboard={scoreboard} />
      ))}
    </Screen>
  );
};
