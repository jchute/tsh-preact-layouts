/**
 * Returns a string of class names joined by a space.
 *
 * @param {...string} classes The class names to join.
 * @returns The joined class names.
 */
export const cx = (...classes) => classes.filter(Boolean).join(" ");
