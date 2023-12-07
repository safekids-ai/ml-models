FROM node:20.9-alpine AS base
EXPOSE 3000
EXPOSE 4200
EXPOSE 4300

FROM base AS pruned
WORKDIR /apps

COPY package.json package-lock.json .
RUN ls -la /apps
RUN apk update && apk add curl
#SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN if [ "$BUILDARCH" = "arm64" ]; then \
        apk update && \
        apk add libc6-arm64; \
    fi
RUN npm i --production
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune
RUN ls -la /apps

EXPOSE 3000
EXPOSE 4200
EXPOSE 4300

FROM base as development
WORKDIR /apps
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./model_files ./model_files
COPY package.json package-lock.json tsconfig.base.json nx.json .
RUN npm i
RUN ls -la
RUN npx nx run-many -t build --prod
EXPOSE 3000
EXPOSE 4200
EXPOSE 4300
CMD ["npx", "nx", "serve", "ml-api", "--configuration=development"]

FROM base AS production
WORKDIR /apps
COPY --from=development /apps/dist/apps ./dist
COPY --from=pruned /apps/package.json ./
COPY --from=pruned /apps/node_modules ./node_modules
EXPOSE 3000
EXPOSE 4200
EXPOSE 4300
CMD ["node", "/apps/dist/ml-api-web/launch.js"]
#CMD ["node", "/apps/dist/ml-api/main.js"]
