FROM node:18 AS nws-material

WORKDIR /app

COPY . /app
RUN npm ci && npm run build

EXPOSE 3006

ENTRYPOINT ["npm", "run", "start"]