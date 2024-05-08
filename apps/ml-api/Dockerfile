FROM node:bullseye-slim AS builder
RUN npm install -g pnpm
WORKDIR /build
RUN cd /build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./

ENV NODE_ENV=production

RUN npx nx run ml-api:build:production

FROM node:bullseye-slim AS deployer

ARG API_PORT=3000
ENV API_PORT=$API_PORT
ENV NODE_ENV=production

WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /build/dist/apps/ml-api/package.json .
COPY --from=builder /build/dist/apps/ml-api/pnpm-lock.yaml .
COPY --from=builder /build/dist/apps ./dist
COPY --from=builder /build/model_files ./model_files

RUN pnpm i

EXPOSE $API_PORT

CMD ["node", "dist/ml-api/main.js"]
