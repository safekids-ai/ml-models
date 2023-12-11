FROM node:slim AS base
ARG API_URL
ARG WEB_PORT=4200
EXPOSE $WEB_PORT

FROM base as development
ENV API_URL=$API_URL
RUN echo "The value of API_URL is: $API_URL"
WORKDIR /apps

RUN npm install -g pnpm

COPY ./apps ./apps
COPY ./libs ./libs
COPY ./scripts ./scripts
COPY ./model_files ./model_files
COPY package.json pnpm-lock.yaml tsconfig.base.json nx.json .
RUN pnpm i
RUN npx nx run ml-api-web:build:production
EXPOSE $WEB_PORT

FROM base AS production
ENV NODE_ENV=production
ENV WEB_PORT=$WEB_PORT

WORKDIR /apps

RUN npm init -y
RUN npm install express

COPY --from=development /apps/scripts/ .
COPY --from=development /apps/dist/apps ./dist

EXPOSE $WEB_PORT

CMD ["./docker_run_web.sh"]
