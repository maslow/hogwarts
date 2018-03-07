<template>
    <div class="login-form">
        <h3>
            请登录
        </h3>
        <hr/>
        <Row>
            <Col><span class="label">邮箱</span></Col>
            <Col>
            <Input v-model="email" type="text" style="width: 300px;"></Input>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col><span class="label">密码</span></Col>
            <Col>
            <Input v-model="password" type="password" style="width: 300px"></Input>
            </Col>
        </Row>
        <Row style="margin-top: 15px;">
            <Col>
            <Button type="primary" style="width: 300px" @click="login">Login</Button>
            </Col>
        </Row>
        <Row style="margin-top: 15px;">
            <router-link to="/register">没有账户？注册</router-link>
        </Row>
    </div>
</template>

<script>
import user from '@/api/user.js'
import identity from '@/api/identity.js'
import validator from 'validator'

if(!identity.isExpired())
    window.history.back()

export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login() {
            let msg = null
            if(validator.isEmail(this.email) === false)
                msg = "邮件格式不正确"
            
            if(this.password.length < 6 || this.password.length > 18)
                msg = "密码长度不少于6, 不大于18"
        
            if(msg)
                return this.$Notice.error({
                    title: msg
                })

            this.$Spin.show();
            try {
                let ret = await user.Login(this.email, this.password)
                identity.set(ret)
                window.location.reload()
            } catch (err) {
                console.log(err)
                this.$Notice.error({
                    title: 'Failed to login'
                })
            }
            this.$Spin.hide()
        }
    }
}
</script>

<style scoped>
.login-form {
    width: 400px;
    margin: 30px auto 100px;
}
.login-form h3{
    font-weight:300;
    font-size: 18px;
}
.login-form hr{
    margin-bottom: 50px;
    margin-left:2px;
    width: 300px;
    background-color: lightgray;
}

.label{
    color: gray;
    font-weight: 300;
    font-size: 16px;
}
</style>