FROM node:slim AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npx nx run main-website-react:build:production

FROM node:slim AS deployer
ARG WEB_PORT=3000
EXPOSE $WEB_PORT
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/dist/apps/main-website-react .
RUN pnpm install
EXPOSE $WEB_PORT
CMD ["npm", "run", "start"]
