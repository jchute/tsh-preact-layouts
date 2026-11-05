import "@Assets/Scss/theme.scss";
import { render } from "preact";
import { App } from "./App";
import { readPageScope } from "@State/scope";
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
const layout = params.get("layout") ?? container.dataset.layout;

render(<App layout={layout} scope={readPageScope(params, container.dataset)} />, container);
