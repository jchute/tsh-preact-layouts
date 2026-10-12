import layouts from "virtual:layouts";
import { BaseNotice } from "../BaseNotice";
import { LayoutLink } from "@Components/Elements/Navigation/LayoutLink";
import { RequestedAs } from "./RequestedAs";

/**
 * Notice for when a layout cannot be rendered.
 *
 * @param {object} props
 * @param {string} [props.layout] Requested layout name.
 */
export const LayoutNotice = ({ layout }) => {
  const names = Object.keys(layouts);

  if (!names.length) {
    return (
      <BaseNotice heading="No layouts found">
        <p>
          No layouts were discovered within the layout directory at <code>src/Layouts</code>.
        </p>

        <p>
          Add a file such as <code>Game.jsx</code>, or a folder with an index file such as{" "}
          <code>Game/index.jsx</code>. Names starting with <code>_</code> or containing extra dots
          are not loaded.
        </p>
      </BaseNotice>
    );
  }

  if (!layout || !(layout in layouts)) {
    return (
      <BaseNotice heading="Layout not found">
        <p>
          {layout ? (
            <>
              There is no layout named <code>{layout}</code>.
            </>
          ) : (
            <>No layout name was provided.</>
          )}
        </p>

        <RequestedAs />

        <h2>Available layouts</h2>

        <ul>
          {names.map((name) => (
            <li key={name}>
              <LayoutLink name={name} />
            </li>
          ))}
        </ul>

        <p>
          <small>
            Set <code>?layout=YourLayoutName</code> in the URL, or the <code>data-layout</code>{" "}
            attribute on <code>#app</code>.
          </small>
        </p>
      </BaseNotice>
    );
  }

  return (
    <BaseNotice heading="Layout could not be loaded">
      <p>
        <code>{layout}</code> was found, but it does not export a usable component.
      </p>

      <RequestedAs />

      <h2>A layout needs one of</h2>

      <ul>
        <li>a default exported component</li>
        <li>an exported component named the same as the layout</li>
        <li>exactly one exported component</li>
      </ul>
    </BaseNotice>
  );
};
