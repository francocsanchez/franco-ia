import { Bot, GrammyError, HttpError } from "grammy";
import { getTelegramConfig } from "../config/telegram";
import { handleHelpCommand } from "../handlers/telegram/help.handler";
import { handleMessage } from "../handlers/telegram/message.handler";
import { handleStartCommand } from "../handlers/telegram/start.handler";
import { type TelegramBot, type TelegramContext } from "../types/telegram";

const UNAUTHORIZED_MESSAGE = "No estas autorizado para utilizar este bot.";

let telegramBot: TelegramBot | null = null;

const isChatAllowed = (context: TelegramContext, allowedChatIds: Set<number>) => {
  if (allowedChatIds.size === 0) {
    return true;
  }

  const chatId = context.chat?.id;

  return typeof chatId === "number" && allowedChatIds.has(chatId);
};

const logTelegramEvent = (label: string, context: TelegramContext) => {
  const chatId = context.chat?.id ?? "unknown";
  const userName = context.from?.username ?? context.from?.first_name ?? "unknown";
  const text = context.message?.text ?? "non-text-update";

  console.log(`[telegram] ${label} | user=${userName} | chatId=${chatId} | message=${text}`);
};

const registerHandlers = (bot: TelegramBot, allowedChatIds: Set<number>) => {
  bot.use(async (context, next) => {
    logTelegramEvent("incoming_update", context);

    if (!isChatAllowed(context, allowedChatIds)) {
      console.warn(
        `[telegram] unauthorized_chat | user=${context.from?.username ?? context.from?.first_name ?? "unknown"} | chatId=${context.chat?.id ?? "unknown"}`
      );
      await context.reply(UNAUTHORIZED_MESSAGE);
      return;
    }

    await next();
  });

  bot.command("start", async (context) => {
    console.log(`[telegram] command=/start | chatId=${context.chat.id} | user=${context.from?.username ?? context.from?.first_name ?? "unknown"}`);
    await handleStartCommand(context);
  });

  bot.command("help", async (context) => {
    console.log(`[telegram] command=/help | chatId=${context.chat.id} | user=${context.from?.username ?? context.from?.first_name ?? "unknown"}`);
    await handleHelpCommand(context);
  });

  bot.on("message:text", handleMessage);
};

export const startTelegramBot = async () => {
  const config = getTelegramConfig();
  const bot = new Bot<TelegramContext>(config.token);

  registerHandlers(bot, config.allowedChatIds);

  bot.catch((error) => {
    const { ctx } = error;

    console.error(
      `[telegram] error | chatId=${ctx.chat?.id ?? "unknown"} | user=${ctx.from?.username ?? ctx.from?.first_name ?? "unknown"}`
    );

    if (error.error instanceof GrammyError) {
      console.error(`[telegram] grammy_error | ${error.error.description}`);
      return;
    }

    if (error.error instanceof HttpError) {
      console.error(`[telegram] http_error | ${error.error.message}`);
      return;
    }

    console.error("[telegram] unknown_error", error.error);
  });

  await bot.start();
  telegramBot = bot;

  console.log("[telegram] bot started");
};

export const stopTelegramBot = async () => {
  if (!telegramBot) {
    return;
  }

  await telegramBot.stop();
  telegramBot = null;
  console.log("[telegram] bot stopped");
};
