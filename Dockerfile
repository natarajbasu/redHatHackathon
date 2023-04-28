From node:16
WORKDIR /usr/src/app
copy package.json ./
RUN npm install
COPY . .
EXPOSE 8500
CMD [ "node", "server.js" ]