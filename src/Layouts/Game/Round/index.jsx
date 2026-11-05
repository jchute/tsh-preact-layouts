import styles from "./round.module.scss";
import { BestOf, RoundName } from "@Components/TSH";
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
      <RoundName />
      <BestOf className={styles.bestof} setLengthTextVariant="text" />
    </div>
  );
};
