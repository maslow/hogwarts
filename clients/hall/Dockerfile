FROM node:8
RUN npm install http-server -g

ADD . /app
RUN cd /app && npm install
RUN cd /app && npm run build

EXPOSE 80
WORKDIR /app/dist
CMD [ "http-server", "-p", "80"]