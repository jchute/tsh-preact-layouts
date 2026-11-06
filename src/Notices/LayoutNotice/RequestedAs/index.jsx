/** Shows how the current page asked for a layout, when that can be recovered. */
export const RequestedAs = () => {
  const fromUrl = new URLSearchParams(window.location.search).get("layout");
  const fromDom = document.getElementById("app")?.dataset.layout;

  if (fromUrl == null && fromDom == null) {
    return;
  }

  return (
    <>
      <h2>Requested as</h2>

      <ul>
        {fromUrl != null && (
          <li>
            <code>?layout={fromUrl}</code>
          </li>
        )}
        {fromDom != null && (
          <li>
            <code>{`data-layout="${fromDom}"`}</code>
          </li>
        )}
      </ul>

      {fromUrl && fromDom && (
        <p>
          <small>
            <code>?layout</code> will override <code>data-layout</code>.
          </small>
        </p>
      )}
    </>
  );
};
