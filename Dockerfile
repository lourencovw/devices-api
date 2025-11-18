FROM node:22-alpine

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --production

COPY . .

RUN npm run build || true

EXPOSE 3333

CMD ["node", "build/bin/server.js"]
