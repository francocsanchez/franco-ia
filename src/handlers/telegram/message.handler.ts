import { type TelegramContext } from "../../types/telegram";
import { askOllama } from "../../services/ollama.service";

export const handleMessage = async (context: TelegramContext) => {
  const message = context.message?.text;

  if (!message) {
    return;
  }

  const userName = context.from?.username ?? context.from?.first_name ?? "unknown";
  const chatId = context.chat?.id ?? "unknown";

  console.log(`[telegram] message_received | user=${userName} | chatId=${chatId} | message=${message}`);

  try {
    const response = await askOllama(message);

    if (!response.trim()) {
      await context.reply("No pude generar una respuesta.");
      return;
    }

    await context.reply(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Telegram message error";
    console.error(`[telegram] ollama_failed | user=${userName} | chatId=${chatId} | error=${errorMessage}`);
    await context.reply("No pude procesar tu mensaje en este momento.");
  }
};
