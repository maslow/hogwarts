FROM centos:7
RUN yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

RUN yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

RUN yum install -y docker-ce

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs

ADD . /app
WORKDIR /app
EXPOSE 80

RUN npm i
ENV DEBUG=EVAL:*
CMD [ "node", "app.js" ]