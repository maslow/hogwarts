### 服务端共5个服务：
    - auth:    提供用户认证服务；   (Nodejs)
    - course:  提供课程服务；     (Nodejs & MySQL)
    - job:     提供用户作业服务；     (Nodejs & MySQL)
    - eval:    提供用户作业的评测服务； (Nodejs & docker)
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

### 服务默认端口分配：
    - gateway: 8888
    - web:     80/443

### 部署说明
> 安装node(version >= 8.x)
```shell
    curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
    sudo yum -y install nodejs gcc-c++ make
```

> 安装所有服务的依赖, 见npm.sh
```shell
    sh npm.sh
```

> 安装并启动docker
```shell
    yum install docker -y
    systemctl start docker
```

> 启动服务端服务组
```shell
    node server.js init     #创建并启动服务组
    node server.js stop     #or 停止正在运行的服务组
    node server.js start    #or 启动已停止的服务组
    node server.js remove   #or 删除已停止的服务组
```