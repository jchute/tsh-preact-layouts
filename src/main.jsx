import "@Assets/Scss/theme.scss";
import { render } from "preact";
import { App } from "./App";
import { DEFAULTS } from "@State/selectors";
import { getSettings } from "@State/settings";

// Dev Mode
if (import.meta.env.DEV) {
  getSettings().then((settings) => {
    if (settings.dev.showDevBackground) {
      document.body.classList.add("dev-background");
    }
  });
}

// URL parameters take priority over the data attributes on #app
const params = new URLSearchParams(window.location.search);
const container = document.getElementById("app");
const readOption = (key) => params.get(key) ?? container.dataset[key];

// Any picking prop can be set for the whole page, e.g. ?team=2 or data-last-set="2"
const scope = {};
for (const key of Object.keys(DEFAULTS)) {
  const value = readOption(key);

  if (value != null && value !== "") {
    scope[key] = Number.isNaN(Number(value)) ? value : Number(value);
  }
}

render(<App layout={readOption("layout")} scope={scope} />, container);
