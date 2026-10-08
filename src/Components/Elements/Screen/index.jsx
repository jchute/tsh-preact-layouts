import styles from "./styles.module.scss";
import { cx } from "@Utils/cx";

export const Screen = ({ children, className }) => {
  return <div className={cx(styles.screen, className)}>{children}</div>;
};
