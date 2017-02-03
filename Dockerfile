FROM node:7
WORKDIR /usr/src/app
COPY ./dist /usr/src/app
CMD [ "node", "index.js" ]
