FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Create temp directory with write permissions for all users
RUN mkdir -p /usr/src/app/temp && chmod 777 /usr/src/app/temp

COPY --chown=node:node package.json .

RUN npm install --unsafe-perm=true

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm", "run", "start"]
