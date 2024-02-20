FROM node:alpine

WORKDIR app

ENV DATABASE_HOST=localshot

COPY package.json .

COPY . .


RUN corepack enable

RUN corepack prepare pnpm@latest --activate

RUN pnpm install

RUN pnpm prisma generate


CMD ["pnpm", "run", "start:dev"]