# Template GitFlow + GitHub Actions

Infra extraída de https://github.com/muri-sc/senai-gitflow (só pipeline, sem o código).

## Branches
- `main` – produção
- `develop` – integração (branch padrão)
- `feat/<nome>` – uma por funcionalidade, criada a partir de `develop`

Fluxo: `feat/*` → PR para `develop` → (release) PR de `develop` para `main`.

## Pipelines (rodam em todo PR para `develop`)
- **Tests** (`.github/workflows/tests.yml`): Node 22, `npm ci`, `npm test`.
- **Docker Tests** (`.github/workflows/docker.yml`): `docker build` e roda os testes dentro do container.

## Requisitos do projeto novo
- `package.json` com script `test` e `package-lock.json` commitado (o `npm ci` exige).

## Configurar no GitHub (manual)
1. Settings → Branches → default branch = `develop`.
2. Branch protection em `develop` e `main`: exigir PR e marcar os checks `test` e `build` como obrigatórios.

## API de exemplo (to-do list)
Express, dados em memória (somem quando o servidor reinicia). Porta padrão: `3000`.

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/todos` | – | 200 + lista |
| POST | `/todos` | `{ "title": "..." }` | 201 + tarefa (400 sem `title`) |
| PUT | `/todos/:id` | `{ "title"?: "...", "done"?: true }` | 200 + tarefa (404 se não existir) |
| DELETE | `/todos/:id` | – | 204 (404 se não existir) |

```bash
npm install
npm test
npm start
curl -X POST localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Estudar Docker"}'
curl localhost:3000/todos
```

## Docker
```bash
docker build -t todo-api .                 # cria a imagem
docker run -p 3000:3000 todo-api           # sobe a API em localhost:3000
docker run --rm todo-api npm test          # roda os testes no container (igual à pipeline)
```

### Publicar no Docker Hub
```bash
docker login
docker tag todo-api SEU_USUARIO/todo-api:1.0
docker tag todo-api SEU_USUARIO/todo-api:latest
docker push SEU_USUARIO/todo-api:1.0
docker push SEU_USUARIO/todo-api:latest
```
