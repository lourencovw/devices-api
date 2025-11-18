FROM node:22-alpine

ENV DOCKERIZE_VERSION v0.9.7

RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

WORKDIR /app
EXPOSE 3333

COPY . .
RUN npm ci
RUN npm run build
CMD ["node", "./build/bin/server.js"]