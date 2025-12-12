FROM node:20-bullseye-slim

RUN npm install -g pnpm

ENV NODE_OPTIONS="--max-old-space-size=1536"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ENV NODE_ENV=production

RUN pnpm prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]