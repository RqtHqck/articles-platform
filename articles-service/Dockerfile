FROM node:22-alpine

WORKDIR /app/article-service

# curl
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npm run compile

ENV NODE_ENV=dev

EXPOSE 3001

CMD ["npm", "run", "start"]