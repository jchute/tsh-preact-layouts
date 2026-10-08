import styles from "./styles.module.scss";
import { DisplayName, DisplayTag, Score, Side } from "@Components/TSH";
import { cx } from "@Utils/cx";

export const Player = ({ className, flip = false, team }) => {
  return (
    <div className={cx(className, styles.team, flip && styles.flip)}>
      <Score className={styles.score} team={team} />
      <DisplayTag className={styles.tag} team={team} hide />
      <DisplayName className={styles.name} team={team} />
      <Side className={styles.side} team={team} />
    </div>
  );
};
