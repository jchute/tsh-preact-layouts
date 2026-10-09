import styles from "./styles.module.scss";
import { cx } from "@Utils/cx";

/**
 * Shows an image sized like text (1em square by default). By default the image is used as a mask,
 * so only its shape shows, filled with the current text color and given a small drop shadow, which
 * suits single-color icons. Turn `mask` off for photos and full-color art.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for styling.
 * @param {string} [props.height] CSS height. Defaults to `width`, keeping it square.
 * @param {boolean} [props.hide] Render nothing when there is no image, instead of an empty box.
 * @param {boolean} [props.mask] Tint the image with the text color rather than showing it as-is.
 * @param {string} [props.source] Image URL.
 * @param {string} [props.width] CSS width.
 */
export const Image = ({ className, height, hide = false, mask = true, source, width }) => {
  // Do nothing if we are hiding empty source and there is no source
  if (hide && !source) {
    return null;
  }

  const style = {};

  if (source) {
    style["--src"] = `url("${source}")`;
  }

  if (width) {
    style.width = width;
  }

  if (height || width) {
    style.height = height || width;
  }

  return <span className={cx(styles.image, !mask && styles.photo, className)} style={style} />;
};
