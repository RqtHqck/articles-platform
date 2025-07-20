FROM node:22-alpine

WORKDIR /app/search-service

# curl
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile

EXPOSE 3003

CMD ["npm", "run", "start"]