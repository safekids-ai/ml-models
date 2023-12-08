FROM node:20.9-bullseye-slim AS base
ARG TARGETPLATFORM
EXPOSE 3000
EXPOSE 4200
EXPOSE 4300

FROM base AS pruned
WORKDIR /apps

COPY package.json package-lock.json .
RUN apt update && apt -y install curl
RUN npm i --production
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

EXPOSE 3000
EXPOSE 4200

FROM base as development
WORKDIR /apps
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./model_files ./model_files
COPY package.json package-lock.json tsconfig.base.json nx.json .
RUN npm i
RUN npx nx run-many -t build --prod
EXPOSE 3000
EXPOSE 4200

FROM base AS production
WORKDIR /apps
COPY --from=development /apps/dist/apps ./dist
COPY --from=development /apps/model_files ./model_files
COPY --from=pruned /apps/package.json ./
COPY --from=pruned /apps/node_modules ./node_modules
RUN ls -la /apps/model_files
RUN ls -la /apps/dist/ml-api/
EXPOSE 3000
EXPOSE 4200
#CMD ["node", "dist/ml-api/main.js"]
#CMD ["npx", "http-server", "/apps/dist/ml-api-web/", "-p 4200", "-d false", "-g true", "-b true", ""]
