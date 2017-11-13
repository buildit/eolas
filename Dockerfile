FROM node:6.3.0-wheezy
WORKDIR /usr/src/app
COPY ./dist /usr/src/app
RUN npm install --production
CMD [ "node", "index.js" ]
