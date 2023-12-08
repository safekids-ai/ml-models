FROM node:20.9-bullseye-slim AS base
ARG API_URL
ARG API_PORT=3000
ARG WEB_PORT=4200
EXPOSE $API_PORT
EXPOSE $WEB_PORT

FROM base AS pruned
WORKDIR /apps

RUN apt update && apt -y install curl

COPY package.json package-lock.json .
RUN npm uninstall onnxruntime-web onnxruntime-react @nx react react-icons react-native jsc-android react-devtools-core @react-native-community react-dom @react-native @chakra-ui
RUN npm i --production

RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

EXPOSE 3000
EXPOSE 4200

FROM base as development
ENV API_URL=$API_URL
RUN echo "The value of API_URL is: $API_URL"
WORKDIR /apps

COPY ./apps ./apps
COPY ./libs ./libs
COPY ./scripts ./scripts
COPY ./model_files ./model_files
COPY package.json package-lock.json tsconfig.base.json nx.json .
RUN npm i
RUN npx nx run-many -t build --prod
EXPOSE 3000
EXPOSE 4200

FROM base AS node_modules_runtime-only
WORKDIR /apps

COPY --from=pruned /apps/node_modules ./node_modules
RUN rm -rf ./node_modules/react-native && \
    rm -rf ./node_modules/jsc-android && \
    rm -rf ./node_modules/@chakra-ui && \
    rm -rf ./node_modules/react-devtools-core && \
    rm -rf ./node_modules/@react-native-community && \
    rm -rf ./node_modules/react-dom && \
    rm -rf ./node_modules/@react-native && \
    rm -rf ./node_modules/@emotion


EXPOSE 3000
EXPOSE 4200

FROM base AS production
ENV NODE_ENV=production
ENV API_PORT=$API_PORT
ENV WEB_PORT=$WEB_PORT

WORKDIR /apps

COPY --from=development /apps/scripts/ .
COPY --from=development /apps/dist/apps ./dist
COPY --from=development /apps/model_files ./model_files
COPY --from=pruned /apps/package.json ./
COPY --from=node_modules_runtime-only /apps/node_modules ./node_modules

EXPOSE $API_PORT
EXPOSE $WEB_PORT
