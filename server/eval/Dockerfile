FROM centos
RUN yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

RUN yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

RUN yum install -y docker-ce

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs
RUN npm install mocha -g
WORKDIR /app