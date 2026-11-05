import { cx } from "@Utils/cx";
import styles from "./image.module.scss";

/**
 * Display an image with options for sizing.
 *
 * @param {object} props
 * @param {string} [props.alt] Alternative text. Defaults to empty, marking the image as decorative.
 * @param {string} [props.className] Extra classes for styling.
 * @param {string|number} [props.height] CSS height, defaults to the width or 1em.
 * @param {string} [props.src] Image URL.
 * @param {string|number} [props.width] CSS width, defaults to the height or 1em.
 */
export const Image = ({ alt = "", className, height, src, width }) => {
  if (!src) {
    return null;
  }

  return (
    <img
      alt={alt}
      className={cx(styles.image, className)}
      src={src}
      style={{
        height: height ?? width,
        width: width ?? height,
      }}
    />
  );
};
