FROM node:lts-jessie

RUN curl -k -o linux_signing_key.pub https://dl-ssl.google.com/linux/linux_signing_key.pub
RUN apt-key add linux_signing_key.pub
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

COPY package.json yarn.lock ./
RUN yarn config set proxy http://www-authproxy.statoil.net:80
RUN yarn config set https-proxy http://www-authproxy.statoil.net:80
RUN yarn

RUN mkdir /client && cp -R ./node_modules ./client

WORKDIR /client
COPY src ./src
COPY *.json ./
COPY builder.js builder.js
COPY gulpfile.js gulpfile.js
COPY testing ./testing
COPY projects ./projects

ARG PROJECT=ALL

RUN node builder --project core
RUN node builder --project form

WORKDIR /client/dist/stoui-core
RUN yarn link
WORKDIR /client
RUN yarn link @ngx-stoui/core

RUN if [ "$PROJECT" != "ALL" ]; then $(npm bin)/ng test --codeCoverage=true --watch=false --browsers=ChromeCustom stoui-$PROJECT; fi;
