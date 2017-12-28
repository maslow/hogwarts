### 服务端共5个服务：
    - auth:    提供用户认证服务；   (Nodejs)
    - course:  提供课程服务；     (Nodejs & Mongodb)
    - job:     提供用户作业服务；     (Nodejs & MySQL)
    - eval:    提供用户作业的评测服务； (Nodejs & Docker)
    - gateway: 提供代理服务，以上所有服务均通过该网关对外提供；  (Nodejs)

### 请求过程说明：
> 所有来自客户端的请求，都由gateway来转发给实际服务；
> gateway负责对请求的权限进行验证；
    
    -> gateway  
        -> auth
        -> course
        -> job
            -> eval
                -> dbm

### 服务对外端口默认分配：
    - gateway: 8888

### 部署说明
> 安装docker, 其它系统[参考](https://www.docker-cn.com/community-edition))
```shell
    # centos 7.x
    yum install docker -y
    systemctl start docker
```

> 启动服务端服务组
```shell
    docker-compose up
```

> 初始化测试数据
```sh
docker exec server_auth_1 node migrate.js
curl -d "email=test@step8step.com&password=kissme" http://localhost:8888/users

docker exec -it server_mongo_1 mongo

    use tech_course
    db.templatemetas.insert({name:'Node.js v8.9', desc:'Node.js 8.9', docker_image:'template:node-v8.9-mocha', Dockerfile:"FROM node:8.9 \n RUN npm install -g mocha \n RUN mkdir /app"})

    exit

docker build -t template:node-v8.9-mocha ./course/data/templates/1
```