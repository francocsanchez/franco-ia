import { type TelegramContext } from "../../types/telegram";

export const handleStartCommand = async (context: TelegramContext) => {
  const firstName = context.from?.first_name ?? "amigo";

  await context.reply(`Hola ${firstName}, soy el asistente de Instranic.`);
};
