FROM node:latest
EXPOSE 80
WORKDIR /app
ENV DEBUG=DBM:*
ADD . /app
RUN npm i
CMD [ "node", "app.js" ]