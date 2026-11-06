/**
 * Builds a URL that requests a layout while keeping any other query parameters.
 *
 * @param {string} name Layout name to request.
 */
export const LayoutLink = ({ name }) => {
  const params = new URLSearchParams(window.location.search);
  params.set("layout", name);
  return <a href={`?${params}`}>{name}</a>;
};
