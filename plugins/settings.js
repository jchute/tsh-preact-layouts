import { existsSync, readFileSync } from "fs";

/**
 * Serves a settings file from the dev server and emits it into the build output.
 *
 * @param {object} options
 * @param {string} options.file Absolute path of the settings file.
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
export const SettingsFile = ({ file }) => {
  /**
   * Responds to `/settings.json` with the settings file.
   *
   * @param {import("http").IncomingMessage} req Incoming request.
   * @param {import("http").ServerResponse} res Outgoing response.
   * @param {() => void} next Passes the request on when it is not for the settings file.
   */
  const serveSettings = (req, res, next) => {
    const pathname = req.url?.split("?")[0];

    if (pathname !== "/settings.json") {
      next();
      return;
    }

    if (!existsSync(file)) {
      res.statusCode = 404;
      res.end();
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(readFileSync(file));
  };

  return {
    name: "tsh-settings",

    configureServer(server) {
      server.middlewares.use(serveSettings);
    },

    /**
     * Adds the settings file to the build output.
     */
    generateBundle() {
      if (!existsSync(file)) {
        this.error(`Cannot find settings file: ${file}`);
      }

      this.emitFile({
        type: "asset",
        fileName: "settings.json",
        source: readFileSync(file, "utf8"),
      });
    },
  };
};
