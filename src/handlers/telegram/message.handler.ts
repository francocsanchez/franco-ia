import { type TelegramContext } from "../../types/telegram";

export const handleMessage = async (context: TelegramContext) => {
  const message = context.message?.text;

  if (!message) {
    return;
  }

  await context.reply(`Recibi tu mensaje:\n${message}`);
};
