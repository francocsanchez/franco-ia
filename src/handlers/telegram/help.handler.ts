import { type TelegramContext } from "../../types/telegram";

export const handleHelpCommand = async (context: TelegramContext) => {
  await context.reply(
    [
      "Comandos disponibles:",
      "/start - Inicia la conversacion con el asistente.",
      "/help - Muestra esta ayuda."
    ].join("\n")
  );
};
