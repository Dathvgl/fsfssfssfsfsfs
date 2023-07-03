FROM ghcr.io/puppeteer/puppeteer:20.7.3

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install \ && yarn build 
COPY ./dist .
CMD ["node", "-r", "ts-node/register/transpile-only", "-r", "tsconfig-paths/register", "dist/index.js"]
