import { z } from "zod";

export const assistantChatSchema = z.object({
  message: z.string().trim().min(1, "The message field is required")
});
