FROM node:22-slim

WORKDIR /app/api-gateway

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npm run compile

EXPOSE 3000

CMD ["npm", "run", "start"]