import styles from "./styles.module.scss";
import { DisplayName, DisplayTag, Score, Side, useGame } from "@Components/TSH";
import { cx } from "@Utils/cx";
import { getTeam } from "@Utils/selectors";

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
