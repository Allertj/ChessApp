FROM node:18-alpine3.14

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY client/docker/client-package.json ./app/package.json
COPY client/docker/client-package.json ./package.json
# COPY package-lock.json ./

RUN npm install 
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN npm install react-scripts@5.0.1 -g 

COPY client/ ./

CMD ["npm", "run", "start2"]