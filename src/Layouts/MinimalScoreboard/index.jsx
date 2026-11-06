import styles from "./minimal-scoreboard.module.scss";
import { Screen } from "@Components/Elements/Screen";
import { DisplayName, DisplayTag, RoundName, Score, SetLength, useTeam } from "@Components/TSH";
import { cx } from "@Utils/cx";

/**
 * One side of the strip: sponsor over name, then the score. The underline uses the team color set
 * in TSH, falling back to this layout's own colors.
 *
 * @param {object} props
 * @param {boolean} [props.flip] Mirror the side, for the right-hand team.
 * @param {number} props.team Which side to show (1 or 2).
 */
const Contestant = ({ flip = false, team }) => {
  const color = useTeam({ team })?.color;

  return (
    <div
      className={cx(styles.contestant, team === 2 ? styles.two : styles.one, flip && styles.flip)}
      style={{ "--team-color": color }}
    >
      <div className={styles.names}>
        <DisplayTag className={styles.tag} hide team={team} />
        <DisplayName className={styles.name} team={team} />
      </div>
      <Score className={styles.score} team={team} />
    </div>
  );
};

/**
 * Minimal in-game overlay: a thin frosted strip at the top center with both sides, their scores and
 * the round between them.
 */
export const MinimalScoreboard = () => {
  return (
    <Screen className={styles.screen}>
      <div className={styles.strip}>
        <Contestant team={1} />
        <div className={styles.center}>
          <RoundName className={styles.round} hide />
          <SetLength className={styles.length} hide setLengthTextVariant="text" />
        </div>
        <Contestant flip team={2} />
      </div>
    </Screen>
  );
};
