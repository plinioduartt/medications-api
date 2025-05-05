FROM node:18-alpine
WORKDIR /app
COPY /package*.json ./api/
RUN cd ./api && npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]