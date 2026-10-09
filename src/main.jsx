import "@Assets/Scss/theme.scss";
import { render } from "preact";
import { App } from "./App";
import { getSettings } from "@State/settings";

// Dev Mode
if (import.meta.env.DEV) {
  getSettings().then((settings) => {
    document.body.style.setProperty("--body", settings.styles?.dev_body);
  });
}

// URL parameters take priority over the data attributes on #app
const params = new URLSearchParams(window.location.search);
const container = document.getElementById("app");

render(
  <App
    screen={params.get("screen") ?? container.dataset.screen}
    scoreboard={params.get("scoreboard") ?? container.dataset.scoreboard}
  />,
  container,
);
