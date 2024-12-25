FROM node:slim AS builder
WORKDIR /build
COPY package.json pnpm-lock.yaml ./
RUN version=$(grep 'packageManager' package.json | awk -F'"' '{print $4}' | awk -F'@' '{print $2}') && npm install -g "pnpm@$version"

RUN pnpm install --ignore-scripts --frozen-lockfile
COPY . .

ENV API_URL=$API_URL
ENV NODE_ENV=production

RUN pnpm run web-demo

FROM nginx:latest AS deployer

WORKDIR /app
COPY --from=builder /build/dist/apps/ml-api-web-demo /usr/share/nginx/html/
COPY --from=builder /build/scripts/vite-nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
