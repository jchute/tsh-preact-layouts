import styles from "./styles.module.scss";
import { BestOf, Match } from "@Components/TSH";
import { cx } from "@Utils/cx";

export const Round = ({ className }) => {
  return (
    <div className={cx(className, styles.round)}>
      <Match className={styles.match} />
      <BestOf className={styles.bestof} prefix="Best of " />
    </div>
  );
};
