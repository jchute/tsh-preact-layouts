import styles from "./styles.module.scss";
import { BestOf, Match } from "@Components/TSH";
import { cx } from "@Utils/cx";

/**
 * Center piece of the in-game scoreboard showing the round name and set length, e.g.
 * "Winners Final" over "Best of 5".
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for styling.
 */
export const Round = ({ className }) => {
  return (
    <div className={cx(className, styles.round)}>
      <Match className={styles.match} />
      <BestOf className={styles.bestof} variant="text" />
    </div>
  );
};
