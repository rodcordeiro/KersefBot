# Etapa 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copia manifestos e instala dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do projeto e compila
COPY . .
RUN npm run build

# Etapa 2: Execução
FROM node:22-alpine AS runner
WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Executa o código compilado
CMD ["node", "dist/index.js"]
