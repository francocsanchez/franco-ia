import { z } from "zod";
import { env } from "./env";

const telegramConfigSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().trim().min(1, "TELEGRAM_BOT_TOKEN is required"),
  TELEGRAM_ALLOWED_CHAT_IDS: z.string().optional()
});

export type TelegramConfig = {
  token: string;
  allowedChatIds: Set<number>;
};

export const getTelegramConfig = (): TelegramConfig => {
  const parsedConfig = telegramConfigSchema.safeParse({
    TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_ALLOWED_CHAT_IDS: env.TELEGRAM_ALLOWED_CHAT_IDS
  });

  if (!parsedConfig.success) {
    const messages = parsedConfig.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(`Invalid Telegram configuration: ${messages}`);
  }

  const allowedChatIds = new Set(
    (parsedConfig.data.TELEGRAM_ALLOWED_CHAT_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value))
  );

  return {
    token: parsedConfig.data.TELEGRAM_BOT_TOKEN,
    allowedChatIds
  };
};
