import styles from "./styles.module.scss";
import { BestOf, Match } from "@Components/TSH";

export const Round = ({ className }) => {
  return (
    <div className={[className, styles.round].filter(Boolean).join(" ")}>
      <Match className={styles.match} />
      <BestOf className={styles.bestof} prefix={"Best of "} />
    </div>
  );
};
