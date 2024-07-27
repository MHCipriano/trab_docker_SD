#FROM node:14.16.0-alpine3.13
FROM node:14

#RUN addgroup app && adduser -S -G app app
#USER app

#WORKDIR /app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

#CMD ["npm", "start"]
CMD ["node", "index.js"]
