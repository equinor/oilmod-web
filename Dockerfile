# Build with:
# docker build --build-arg PROXY_HOST=www-proxy.statoil.no --build-arg PROXY_PORT=80 -t ai-linapp1022.statoil.no:5000/inventory-overview:latest .

# Stage 1 - build client
FROM ai-linapp1022.statoil.no:5000/node:boron as builder

ARG PROXY_HOST
ARG PROXY_PORT
ARG NO_PROXY

ENV HTTP_PROXY http://$PROXY_HOST:$PROXY_PORT/
ENV HTTPS_PROXY http://$PROXY_HOST:$PROXY_PORT/

ENV NO_PROXY $NO_PROXY

RUN if [ "$PROXY_HOST" = "" ]; then unset HTTP_PROXY; unset HTTPS_PROXY; fi

COPY package.json yarn.lock ./
RUN yarn config set registry http://ai-linapp1022.statoil.no:4873
RUN yarn config set proxy http://$PROXY_HOST:$PROXY_PORT/
RUN yarn config set https-proxy http://$PROXY_HOST:$PROXY_PORT/
RUN yarn

RUN mkdir /client && cp -R ./node_modules ./client

WORKDIR /client
COPY . .

RUN npm run docs

# Stage 2 - Set up Nginx
FROM nginx:1.13.3-alpine

# Copy config and remove default page
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /client/documentation /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
