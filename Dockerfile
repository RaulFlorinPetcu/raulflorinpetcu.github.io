FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

EXPOSE 5000
USER node

RUN npm config set unsafe-perm true

RUN npm install --silent

COPY . .

RUN chown -R node /app/node_modules

USER node

RUN npm run start
