FROM node:22-alpine

WORKDIR /app/search-service

# curl
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npm run compile

ENV NODE_ENV=dev

EXPOSE 3003

CMD ["npm", "run", "start"]