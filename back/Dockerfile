FROM node:18

RUN cd /tmp && \
    git clone https://github.com/emmanueldessaint/projet-octobre.git backend

WORKDIR /tmp/backend

RUN touch .env && \
    echo "PASSWORD=Rumutcho270?" >> .env

RUN cd /tmp/backend && \
    npm install && \
    npm install -g nodemon

EXPOSE 8000

ENTRYPOINT ["nodemon", "server.js"]