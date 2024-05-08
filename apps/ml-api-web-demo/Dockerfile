FROM node:slim AS builder
RUN npm install -g pnpm
WORKDIR /build
RUN cd /build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./

ENV API_URL=$API_URL
ENV NODE_ENV=production

RUN npx nx run ml-api-web:build-demo:production
RUN ls -la /build/dist/apps/ml-api-web-demo

FROM nginx:latest AS deployer

WORKDIR /app
COPY --from=builder /build/dist/apps/ml-api-web-demo /usr/share/nginx/html/
COPY --from=builder /build/scripts/vite-nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
