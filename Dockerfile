# build client app
FROM node:lts AS build-env

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /spa-tmp
COPY . .
RUN npm ci && npm run build


FROM node:lts

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY --from=build-env /spa-tmp/dist .

RUN npm i -g spa-http-server

EXPOSE 8080
ENTRYPOINT ["hs", "/frontend", "--push-state", "true"]