FROM node:slim AS builder

ARG API_PORT=3000
ENV API_PORT=$API_PORT

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN version=$(grep 'packageManager' package.json | awk -F'"' '{print $4}' | awk -F'@' '{print $2}') && npm install -g "pnpm@$version"
RUN pnpm install --ignore-scripts --frozen-lockfile
COPY . .

RUN pnpm run build:api:prod

EXPOSE $API_PORT

ENV NODE_ENV=production
ENV APP_ENV=production

#CMD ["tail", "-f", "/dev/null"]
CMD ["node", "dist/apps/ml-api/main.js"]
