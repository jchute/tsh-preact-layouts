import styles from "./styles.module.scss";

export const Screen = ({ children, className }) => {
  return <div className={[styles.screen, className].filter(Boolean).join(" ")}>{children}</div>;
};
