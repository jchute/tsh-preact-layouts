/**
 * Styles for the terminal. Each style provides an open and close code.
 *
 * @readonly
 * @enum {[number, number]}
 */
export const STYLES = {
  // Text styles
  BOLD: [1, 22],
  DIM: [2, 22],
  ITALIC: [3, 23],
  UNDERLINE: [4, 24],
  INVERSE: [7, 27],
  STRIKETHROUGH: [9, 29],

  // Foreground colors
  RED: [31, 39],
  GREEN: [32, 39],
  YELLOW: [33, 39],
  BLUE: [34, 39],
  MAGENTA: [35, 39],
  CYAN: [36, 39],
  WHITE: [37, 39],

  // Background colors
  BG_RED: [41, 49],
  BG_GREEN: [42, 49],
  BG_YELLOW: [43, 49],
  BG_BLUE: [44, 49],
};

/**
 * Builds the escape sequence for one or more codes.
 *
 * @param {number[]} codes The codes to apply.
 * @returns {string} The escape sequence.
 */
const ansi = (codes) => `\x1b[${codes.join(";")}m`;

/**
 * Wraps text in one or more styles.
 *
 * @param {string} message The text to format.
 * @param {Array<[number, number]>} styles One or more styles from `STYLES`.
 * @returns {string} The styled text.
 */
const style = (message, styles = []) => {
  if (styles.length === 0) {
    return message;
  }

  const open = ansi(styles.map(([on]) => on));
  const close = ansi(styles.map(([, off]) => off));

  return `${open}${message}${close}`;
};

/**
 * Colors text in the terminal.
 *
 * @param {string} message The text to format.
 * @param {(typeof STYLES)[keyof typeof STYLES]} [foreground=STYLES.YELLOW] A value from `STYLES`.
 * @returns {string} The colored text.
 */
export const color = (message, foreground = STYLES.YELLOW) => style(message, [foreground]);
