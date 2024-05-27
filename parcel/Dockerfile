FROM node:22.1.0-alpine3.19

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "npx", "parcel", "--host", "0.0.0.0", "src/index.html" ]
