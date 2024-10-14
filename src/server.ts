import { AppConfig } from "./config";
import app from "./app";
import logger from "./utils/logger";

const server = app.listen(AppConfig.get("PORT") || 3000);

(() => {
  try {
    logger.info(`Server is running`, {
      meta: {
        PORT: AppConfig.get("PORT"),
        SERVER_URL: AppConfig.get("SERVER_URL")
      }
    });
  } catch (error) {
    logger.error(`Error starting server`, {
      meta: {
        error
      }
    });

    server.close(() => {
      logger.error(`Server closed`, { meta: { error } });
      process.exit(1);
    });
  }
})();

