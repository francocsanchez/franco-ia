# franco-ai

Backend base en Node.js + TypeScript para un asistente personal de IA conectado a Ollama.

## Stack

- Node.js
- TypeScript
- Express 5
- Axios
- Zod
- Dotenv
- Morgan
- CORS
- Docker
- Docker Compose

## Variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

```env
PORT=4000
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2:3b
```

## Instalacion local

```bash
npm install
npm run dev
```

Para produccion local:

```bash
npm run build
npm start
```

## Endpoint

`POST /api/assistant/chat`

Body:

```json
{
  "message": "Hola, quien sos?"
}
```

Respuesta exitosa:

```json
{
  "ok": true,
  "response": "respuesta generada por el modelo"
}
```

Respuesta de error:

```json
{
  "ok": false,
  "error": "mensaje claro"
}
```

## Docker

Levantar el servicio:

```bash
docker compose up --build -d
```

El servicio `franco-ai` se conecta a una red externa llamada `ollama_default`.

Si en tu servidor la red tiene otro nombre, cambiar este bloque en `docker-compose.yml`:

```yml
networks:
  ollama_network:
    external: true
    name: ollama_default
```

## Notas

- No integra MongoDB.
- No integra Telegram.
- No integra OpenClaw.
- No incluye frontend.
- Espera encontrar el contenedor `ollama` accesible dentro de la red Docker externa.
