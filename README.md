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

Para produccion, `docker-compose.yml` usa la imagen publicada en GHCR:

```bash
docker compose up -d
```

Para desarrollo local con build desde el repo:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
```

El servicio `franco-ai` se conecta a una red externa llamada `ollama_default`.

Si en tu servidor la red tiene otro nombre, cambiar este bloque en `docker-compose.yml`:

```yml
networks:
  ollama_network:
    external: true
    name: ollama_default
```

## Deploy

### Como funciona el pipeline

El workflow [docker.yml](C:/apps/franco-ia/.github/workflows/docker.yml) corre en GitHub Actions y construye la imagen Docker para publicarla en GHCR.

Se ejecuta en estos casos:

- cada `git push` a `main`
- cada push de un tag con formato `v*`, por ejemplo `v1.0.0`

Publica estas tags:

- `ghcr.io/francocsanchez/franco-ai:latest` en cada push a `main`
- `ghcr.io/francocsanchez/franco-ai:sha-<commit_sha_corto>` en cada push a `main`
- `ghcr.io/francocsanchez/franco-ai:vX.X.X` cuando el evento es un tag de version

### Como publicar una nueva version estable

Crear y subir un tag semantico:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Eso publica una imagen versionada como:

```text
ghcr.io/francocsanchez/franco-ai:v1.0.0
```

### Como desplegar latest en Portainer

Usar el [docker-compose.yml](C:/apps/franco-ia/docker-compose.yml) tal como esta, ya que apunta a:

```yml
image: ghcr.io/francocsanchez/franco-ai:latest
```

En Portainer, hacer redeploy o volver a levantar el stack para que descargue la ultima imagen publicada.

### Como volver a una version anterior

Cambiar la imagen en `docker-compose.yml` o en el stack de Portainer por una tag estable publicada, por ejemplo:

```yml
image: ghcr.io/francocsanchez/franco-ai:v1.0.0
```

Luego redeployar el stack.

### Que hacer despues de un git push

1. Hacer push a `main`.
2. Esperar que GitHub Actions publique `latest` y `sha-<commit_sha_corto>` en GHCR.
3. En Portainer, redeployar el stack para descargar la nueva `latest`.

### Que hacer despues de crear un tag

1. Crear y subir el tag `vX.X.X`.
2. Esperar que GitHub Actions publique la imagen versionada en GHCR.
3. En Portainer, actualizar la tag de la imagen si queres fijar esa version exacta.

## Notas

- No integra MongoDB.
- No integra Telegram.
- No integra OpenClaw.
- No incluye frontend.
- Espera encontrar el contenedor `ollama` accesible dentro de la red Docker externa.
