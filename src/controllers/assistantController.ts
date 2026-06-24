import { type Request, type Response } from "express";
import { ZodError } from "zod";
import { assistantChatSchema } from "../schemas/assistantSchema";
import { generateAssistantResponse } from "../services/ollamaService";

export const assistantController = async (req: Request, res: Response) => {
  try {
    const { message } = assistantChatSchema.parse(req.body);
    const response = await generateAssistantResponse(message);

    return res.status(200).json({
      ok: true,
      response
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        error: error.issues[0]?.message ?? "Invalid request body"
      });
    }

    if (error instanceof Error) {
      const statusCode = error.message.includes("Ollama") ? 502 : 500;

      return res.status(statusCode).json({
        ok: false,
        error: error.message
      });
    }

    return res.status(500).json({
      ok: false,
      error: "Unexpected error"
    });
  }
};
