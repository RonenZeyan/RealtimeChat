FROM node:21.6.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

