import "@Assets/Scss/theme.scss";
import { render } from "preact";
import { ScreenLoader } from "@Utils/ScreenLoader";
import { getSettings } from "@Utils/SettingsLoader";

// Dev Mode
getSettings().then((settings) => {
  // Development Styles
  if (import.meta.env.DEV) {
    document.body.style.setProperty("--body", settings.styles?.dev_body);
  }
});

// Get Parameters
const params = new URLSearchParams(window.location.search);

// Preact
const container = document.getElementById("app");

const props = {
  scoreboard: container.dataset.scoreboard,
  screen: container.dataset.screen,
};

render(<ScreenLoader {...props} />, container);
