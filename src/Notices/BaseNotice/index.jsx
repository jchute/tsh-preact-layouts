import styles from "./base-notice.module.scss";

/**
 * Base notice for when an error occurs.
 *
 * @param {object} props
 * @param {string} [props.heading] Custom heading.
 * @param {import("preact").ComponentChildren} [props.children] Custom details.
 */
export const BaseNotice = ({ heading, children }) => {
  return (
    <div className={styles.container} role="alert">
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
