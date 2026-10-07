import styles from "./styles.module.scss";

export const Image = ({ className = "", height, hide = false, source, width }) => {
  // Do nothing if we are hiding empty source and there is no source
  if (hide && !source) {
    return;
  }

  const style = {
    "--src": `url("${source}")`,
  };

  if (width) {
    style.width = width;
  }

  if (height) {
    style.height = height;
  } else {
    if (width) {
      style.height = width;
    }
  }

  return <span className={`${styles.image} ${className}`} style={style}></span>;
};
