import axios from "axios";
import { env } from "../config/env";

type OllamaGenerateResponse = {
  response?: string;
};

export const generateAssistantResponse = async (message: string): Promise<string> => {
  try {
    const { data } = await axios.post<OllamaGenerateResponse>(
      `${env.OLLAMA_URL}/api/generate`,
      {
        model: env.OLLAMA_MODEL,
        prompt: message,
        stream: false
      },
      {
        timeout: 60000
      }
    );

    if (!data.response || typeof data.response !== "string") {
      throw new Error("Ollama returned an invalid response");
    }

    return data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const remoteMessage =
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error.message;

      throw new Error(`Ollama request failed: ${remoteMessage}`);
    }

    if (error instanceof Error) {
      throw new Error(`Ollama error: ${error.message}`);
    }

    throw new Error("Ollama request failed");
  }
};
