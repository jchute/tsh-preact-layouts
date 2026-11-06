import styles from "./screen.module.scss";
import { cx } from "@Utils/cx";

/**
 * Root wrapper for an overlay screen: a full-width 16:9 area laid out as a padded grid.
 *
 * @param {object} props
 * @param {import("preact").ComponentChildren} props.children The overlay contents.
 * @param {string} [props.className] Extra classes for styling.
 * @param {string} [props.gutter] CSS gap between items. Defaults to 1vw.
 * @param {string} [props.padding] CSS padding. Defaults to 1vw.
 */
export const Screen = ({ children, className, gutter = "1vw", padding = "1vw" }) => {
  return (
    <main className={cx(styles.screen, className)} style={{ gap: gutter, padding }}>
      {children}
    </main>
  );
};
