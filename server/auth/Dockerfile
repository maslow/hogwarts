FROM node:latest
EXPOSE 80
WORKDIR /app
ENV DEBUG=AUTH:*
ADD . /app
RUN npm i
CMD [ "node", "app.js" ]