FROM node:8-alpine
EXPOSE 80
WORKDIR /app
ENV DEBUG=COURSE:*
ADD . /app
RUN npm i
CMD [ "node", "app.js" ]