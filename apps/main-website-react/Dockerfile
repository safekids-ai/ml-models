FROM node:slim AS base
ARG WEB_PORT=3000
EXPOSE $WEB_PORT
RUN mkdir mainapp
WORKDIR /mainapp
COPY ./apps/main-website-react ./apps/main-website-react
COPY package.json pnpm-lock.yaml tsconfig.base.json nx.json .
RUN npm install -g pnpm && \
    pnpm i
RUN npx nx run main-website-react:build:production && \
    rm -rf apps && \
    rm -rf node_modules

WORKDIR  /mainapp/dist/apps/main-website-react
RUN pnpm install
EXPOSE $WEB_PORT

CMD ["npm", "run", "start"]
