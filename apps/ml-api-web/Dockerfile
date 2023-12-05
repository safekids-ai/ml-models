FROM node:20.9-bullseye as base

WORKDIR /apps

#Install all packages for one time snapshot
COPY ../../package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --ignore-scripts --unsafe-perm

#Copy the entire codebase
COPY ../../ .

FROM base as development
RUN npx nx run-many -t build
CMD ["npx", "nx", "serve", "ml-api-web", "--configuration=development"]

FROM base as production
ENV NODE_ENV=production
RUN npx nx run-many -t build
CMD ["npx", "nx", "serve", "ml-api-web", "--configuration=production"]
