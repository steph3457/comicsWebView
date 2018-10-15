FROM node:9-alpine as node

RUN apk --update --no-progress add bash git

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

RUN yarn build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=node /app/dist/comicsWebView /app
COPY gzip.conf /etc/nginx/gzip.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]