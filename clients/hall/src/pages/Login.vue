<template>
    <div class="login-form" v-show="!isLogined()">
        <p class="header-title">请登录</p>
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
import user from "@/api/user.js";
import identity from "@/api/identity.js";
import validator from "validator";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async login() {
      if(!this.email)
        return this.$Notice.error({ title: "邮箱不为空" })

      if (validator.isEmail(this.email) === false) 
        return this.$Notice.error({ title: "邮箱格式不正确" })

      if(!this.password)
        return this.$Notice.error({ title: "密码不为空" })

      if (this.password.length < 6 || this.password.length > 18)
        return this.$Notice.error({ title: "密码长度不少于6, 不大于18" })


      this.$Spin.show();
      try {
        let ret = await user.Login(this.email, this.password);
        identity.set(ret);
        return window.location.reload();
      } catch (err) {
        console.log(err);
        if (err.status === 422) {
           this.$Notice.error({ title: err.responseText });
        }else{
          this.$Notice.error({
            title: "Failed to login"
          });
        }
      }
      this.$Spin.hide();
    },
    isLogined(){
        return !identity.isExpired()
    }
  },
  mounted() {
    if (this.isLogined()) return window.history.back()
  }
};
</script>

<style scoped>
.login-form {
  width: 400px;
  margin: 0 auto;
  padding-top: 80px;
}
.login-form .header-title {
  font-weight: 300;
  font-size: 18px;
}
.login-form hr {
  margin-bottom: 20px;
  margin-left: 2px;
  width: 300px;
  background-color: lightgray;
}

.label {
  color: gray;
  font-weight: 300;
  font-size: 16px;
}
</style>