FROM node:slim AS base
ARG WEB_PORT=4200
EXPOSE $WEB_PORT
RUN mkdir mainapp
WORKDIR /mainapp
COPY ./apps/main-website-react ./apps/main-website-react
COPY package.json pnpm-lock.yaml tsconfig.base.json nx.json .
RUN npm install -g pnpm
RUN pnpm i

FROM base as development
WORKDIR /mainapp
EXPOSE $WEB_PORT
#RUN npx nx run main-website-react:build:development

FROM base AS production
ENV NODE_ENV=production
ENV WEB_PORT=$WEB_PORT

WORKDIR /mainapp

RUN npx nx run main-website-react:build:production

EXPOSE $WEB_PORT

CMD ["npx", "nx", "serve", "main-website-react"]
