FROM node:20.9-bullseye-slim AS base
ARG API_PORT=3000
EXPOSE $API_PORT

FROM base as development
WORKDIR /apps

RUN npm install -g pnpm

COPY ./apps ./apps
COPY ./libs ./libs
COPY ./scripts ./scripts
COPY ./model_files ./model_files
COPY package.json pnpm-lock.yaml tsconfig.base.json nx.json .
RUN pnpm i
RUN npx nx run ml-api:build:production
EXPOSE $API_PORT

FROM base AS production
ENV NODE_ENV=production
ENV API_PORT=$API_PORT

WORKDIR /apps

RUN npm install -g pnpm

COPY --from=development /apps/dist/apps/ml-api/package.json .
COPY --from=development /apps/dist/apps/ml-api/pnpm-lock.yaml .
COPY --from=development /apps/scripts/ .
COPY --from=development /apps/dist/apps ./dist
COPY --from=development /apps/model_files ./model_files

RUN pnpm i

EXPOSE $API_PORT

CMD ["./docker_run_api.sh"]
