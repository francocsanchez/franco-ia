import { app } from "./app";
import { env } from "./config/env";
import { startTelegramBot, stopTelegramBot } from "./services/telegramBot.service";

const server = app.listen(env.PORT, async () => {
  console.log(`franco-ai listening on port ${env.PORT}`);

  try {
    await startTelegramBot();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Telegram startup error";
    console.error(`[telegram] startup_failed | ${message}`);
  }
});

const shutdown = async (signal: string) => {
  console.log(`[server] shutdown_signal=${signal}`);

  try {
    await stopTelegramBot();
  } catch (error) {
    console.error("[telegram] shutdown_failed", error);
  }

  server.close(() => {
    console.log("[server] http server stopped");
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
