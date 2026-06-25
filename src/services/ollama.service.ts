import { env } from "../config/env";

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
  error?: string;
};

const OLLAMA_TIMEOUT_MS = 60000;

export const askOllama = async (message: string): Promise<string> => {
  const prompt = message.trim();

  if (!prompt) {
    return "";
  }

  console.log(`[ollama] request_started | model=${env.OLLAMA_MODEL} | message=${prompt}`);

  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${env.OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false
      }),
      signal: abortController.signal
    });

    const data = (await response.json()) as OllamaChatResponse;

    if (!response.ok) {
      const messageFromOllama = typeof data.error === "string" ? data.error : response.statusText;
      throw new Error(`Ollama request failed: ${messageFromOllama}`);
    }

    const content = data.message?.content?.trim() ?? "";

    console.log(`[ollama] request_finished | model=${env.OLLAMA_MODEL} | hasResponse=${content.length > 0}`);

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`[ollama] request_timeout | model=${env.OLLAMA_MODEL}`);
      throw new Error("Ollama request timed out");
    }

    const messageText = error instanceof Error ? error.message : "Unknown Ollama error";
    console.error(`[ollama] request_failed | model=${env.OLLAMA_MODEL} | error=${messageText}`);
    throw new Error(`Ollama error: ${messageText}`);
  } finally {
    clearTimeout(timeout);
  }
};
