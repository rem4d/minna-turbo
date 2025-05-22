import { env } from "./config/envConfig";
import { app, logger } from "./server";

console.log("BOT_TOKEN: ", env.BOT_TOKEN);

const server = app.listen(env.PORT, () => {
  const { HOST, PORT } = env;
  logger.info(`Server running on http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
