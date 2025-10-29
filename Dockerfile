FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i 

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

copy --from=builder /app/dist ./

CMD [ "node","src/index.js" ]
