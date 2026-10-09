import styles from "./styles.module.scss";
import { cx } from "@Utils/cx";

/**
 * Root wrapper for an overlay screen: a full-width 16:9 area laid out as a padded grid.
 *
 * @param {object} props
 * @param {import("preact").ComponentChildren} props.children The overlay contents.
 * @param {string} [props.className] Extra classes for styling.
 */
export const Screen = ({ children, className }) => {
  return <div className={cx(styles.screen, className)}>{children}</div>;
};
