FROM node:slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN version=$(grep 'packageManager' package.json | awk -F'"' '{print $4}' | awk -F'@' '{print $2}') && npm install -g "pnpm@$version"

RUN pnpm install --ignore-scripts --frozen-lockfile
COPY . .
RUN pnpm run homepage

FROM node:slim AS deployer
ARG WEB_PORT=3000
EXPOSE $WEB_PORT
WORKDIR /app
COPY --from=builder /app/dist/apps/main-website-react .
COPY --from=builder /app/package.json  ./package-mono-repo.json
RUN version=$(grep 'packageManager' package.json | awk -F'"' '{print $4}' | awk -F'@' '{print $2}') && npm install -g "pnpm@$version"
RUN version=$(grep '"next":' package-mono-repo.json | awk -F'"' '{print $4}') && pnpm install "next@$version"
EXPOSE $WEB_PORT

#CMD ["tail", "-f", "/dev/null"]
CMD ["npm", "run", "start"]
