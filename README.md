Just do it!
==========
> Hogwarts , Interactive Programming Teaching Platform


Cluster Setup (Production)
==========================
#### Install Docker [Reference](https://www.docker-cn.com/community-edition)

#### Setup cluster
```sh
    # clone repo
    git clone https://code.aliyun.com/step8step/hogwarts.git

    cd ./hogwarts

    # init cluster
    docker swarm init

    # create a password for portainer admin
    # replace `abc123` with your actual password
    echo -n abc123 | docker secret create portainer-pass -

    # login aliyun registry hub
    docker login --username=wangfugen@126.com registry.cn-hongkong.aliyuncs.com

    # launch cluster
    docker stack deploy -c docker-stack.yaml hogwarts --with-registry-auth
```

Localhost Setup (Development)
=============================

### Server
 See [/server/README.md](server/README.md)

### Client
 Hall [/clients/hall/README.md](clients/hall/README.md)
 Kitchen [/clients/kitchen/README.md](clients/kitchen/README.md)