FROM node:18

RUN cd /tmp && \
    git clone https://github.com/emmanueldessaint/front-projet-octobre.git frontend

WORKDIR /tmp/frontend

RUN cd /tmp/frontend && \
    npm install 

EXPOSE 3006

ENTRYPOINT ["npm", "run", "start"]