import styles from "./styles.module.scss";
import { DisplayName, DisplayTag, Score, Side, useGame } from "@Components/TSH";
import { cx } from "@Utils/cx";
import { getTeam } from "@State/selectors";

/**
 * One side's half of the in-game scoreboard: score, sponsor or partner names, name and
 * winners/losers marker, tinted with the team color set in TSH.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for styling.
 * @param {boolean} [props.flip] Mirror the layout, for the side on the right.
 * @param {number} props.team Which side to show (1 or 2).
 */
export const Player = ({ className, flip = false, team }) => {
  const game = useGame();

  return (
    <div
      className={cx(className, styles.team, flip && styles.flip)}
      style={{ "--team-color": getTeam(game, team)?.color }}
    >
      <Score className={styles.score} team={team} />
      <DisplayTag className={styles.tag} team={team} hide />
      <DisplayName className={styles.name} team={team} />
      <Side className={styles.side} team={team} />
    </div>
  );
};
