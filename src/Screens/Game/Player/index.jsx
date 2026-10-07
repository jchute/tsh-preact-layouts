import styles from "./styles.module.scss";
import { DisplayName, DisplayTag, Score, Side } from "@Components/TSH";

export const Player = ({ className, flip = false, team }) => {
  return (
    <div className={[className, styles.team, flip && styles.flip].filter(Boolean).join(" ")}>
      <Score className={styles.score} team={team} />
      <DisplayTag className={styles.tag} team={team} hide />
      <DisplayName className={styles.name} team={team} />
      <Side className={styles.side} team={team} />
    </div>
  );
};
