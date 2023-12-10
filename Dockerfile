FROM node:20.9-bullseye-slim AS base
ARG API_URL
ARG API_PORT=3000
ARG WEB_PORT=4200
EXPOSE $API_PORT
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
RUN npx nx run-many -t build --prod
EXPOSE 3000
EXPOSE 4200

FROM base AS production
ENV NODE_ENV=production
ENV API_PORT=$API_PORT
ENV WEB_PORT=$WEB_PORT

WORKDIR /apps

RUN npm install -g pnpm

COPY --from=development /apps/dist/apps/ml-api/package.json .
COPY --from=development /apps/dist/apps/ml-api/pnpm-lock.yaml .
COPY --from=development /apps/scripts/ .
COPY --from=development /apps/dist/apps ./dist
COPY --from=development /apps/model_files ./model_files

RUN pnpm i

RUN pnpm install express

EXPOSE $API_PORT
EXPOSE $WEB_PORT
