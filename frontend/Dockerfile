FROM node:alpine AS BUILD_IMAGE

WORKDIR /frontend

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

RUN npm prune --production

FROM node:alpine

WORKDIR /frontend

# copy from build image
COPY --from=BUILD_IMAGE /frontend/build ./build
COPY --from=BUILD_IMAGE /frontend/node_modules ./node_modules
COPY --from=BUILD_IMAGE /frontend/package.json ./

EXPOSE 5000

CMD [ "yarn", "serve", "-s", "build" ]