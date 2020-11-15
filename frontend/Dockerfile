FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm ci --only=production
COPY . .

EXPOSE 5000
RUN npm install -g serve
CMD [ "serve", "-s", "build" ]