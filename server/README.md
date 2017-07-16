### 服务端共5个服务组：
    - auth:  提供用户认证服务；   (Nodejs)
    - course:  提供课程服务；     (Nodejs & MySQL)
    - job:  提供用户作业服务；     (PHP/Yii2)
    - eval:  提供用户作业的评测服务； (Nodejs & docker)
    - hagrid: 提供代理服务，以上所有服务均通过该网关对外提供；  (Nodejs)

### 请求过程说明：
> 所有来自客户端的请求，都由hagrid来转发给实际服务组；
> hagrid负责对请求的权限进行验证；
    
    -> hagrid   -> auth
                -> course
                -> job
                -> eval 
                    -> dbm

### 服务端口分配：
    - auth:   8000
    - course: 8001
    - job:    8002
    - eval:   8003
    - dbm:    8004
    - hagrid: 8888
    - web:    80/443

### 部署说明
