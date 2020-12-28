FROM node:alpine
WORKDIR /frontend
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 5000
CMD [ "yarn", "serve", "-s", "build" ]