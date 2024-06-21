FROM node:22.1.0-alpine3.19

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "npm", "run", "start:prod" ]
