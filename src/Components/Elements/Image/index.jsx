import styles from "./styles.module.scss";
import { cx } from "@Utils/cx";

export const Image = ({ className, height, hide = false, source, width }) => {
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

  return <span className={cx(styles.image, className)} style={style} />;
};
