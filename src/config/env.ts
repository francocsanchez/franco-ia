import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  OLLAMA_URL: z.url().default("http://ollama:11434"),
  OLLAMA_MODEL: z.string().min(1).default("llama3.2:3b"),
  TELEGRAM_BOT_TOKEN: z.string().trim().optional(),
  TELEGRAM_ALLOWED_CHAT_IDS: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid environment configuration: ${messages}`);
}

export const env = parsedEnv.data;
