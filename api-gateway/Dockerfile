FROM node:22-alpine

WORKDIR /app/api-gateway

# curl
RUN apk add --no-cache curl bash

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile

EXPOSE 3000

CMD ["npm", "run", "start"]