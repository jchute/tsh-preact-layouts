import styles from "./styles.module.scss";
import { cx } from "@Utils/cx";

/**
 * Shows an image sized like text (1em tall by default), keeping its aspect ratio. With no image,
 * an empty 1em square holds its place unless `hide` is set.
 *
 * @param {object} props
 * @param {string} [props.alt] Alternative text. Defaults to empty, marking the image as decorative.
 * @param {string} [props.className] Extra classes for styling.
 * @param {string} [props.height] CSS height.
 * @param {boolean} [props.hide] Render nothing when there is no image, instead of an empty box.
 * @param {string} [props.source] Image URL.
 * @param {string} [props.width] CSS width.
 */
export const Image = ({ alt = "", className, height, hide = false, source, width }) => {
  const style = { height, width };

  if (!source) {
    return hide ? null : (
      <span className={cx(styles.image, styles.empty, className)} style={style} />
    );
  }

  return <img alt={alt} className={cx(styles.image, className)} src={source} style={style} />;
};
