FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app



COPY --chown=node:node package.json .

RUN npm install --unsafe-perm=true

COPY --chown=node:node . .

RUN chown -R node /usr/src/app/node_modules

USER node

EXPOSE 5000

RUN npm run start

