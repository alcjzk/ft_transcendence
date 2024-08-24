# Static site build
FROM node:22.1.0-alpine3.19

WORKDIR /usr/src/app

COPY parcel .

RUN npm install

RUN npm run build

# Nginx build
FROM nginx:1.26.0-alpine

RUN rm -rf /usr/share/nginx/html

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/
COPY conf/* /etc/nginx/conf.d/

EXPOSE 80
