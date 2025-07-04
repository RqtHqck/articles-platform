FROM node:22-slim

WORKDIR /app/log-service

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npm run compile

ENV NODE_ENV=dev

EXPOSE 3002

CMD ["npm", "run", "start"]