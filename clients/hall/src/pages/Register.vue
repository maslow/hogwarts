<template>
    <div class="login-form" v-cloak v-show="!isLogined()">
        <p class="header-title">欢迎注册</p>
        <hr/>
        <Row>
            <Col><span class="label">邮箱</span></Col>
            <Col>
            <Input v-model="email" type="text" style="width: 300px;"/>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col><span class="label">密码</span></Col>
            <Col>
            <Input v-model="password" type="password" style="width: 300px"/>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col><span class="label">重复密码</span></Col>
            <Col>
            <Input v-model="password_repeat" type="password" style="width: 300px"/>
            </Col>
        </Row>
        <Row style="margin-top: 15px;">
            <Col>
            <Button type="primary" style="width: 300px" @click="login">Register</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
import user from "@/api/user.js";
import identity from "@/api/identity.js";
import validator from "validator";

export default {
  name: "signup",
  data() {
    return {
      email: "",
      password: "",
      password_repeat: ""
    };
  },
  methods: {
    async login() {
      let msg = null;
      if (validator.isEmail(this.email) === false) msg = "邮件格式不正确";

      if (this.password.length < 6 || this.password.length > 18)
        msg = "密码长度不少于6, 不大于18";

      if (this.password != this.password_repeat) msg = "两次密码不一致";

      if (msg) return this.$Notice.error({ title: msg });

      try {
        await user.Register(this.email, this.password);
        let ret = await user.Login(this.email, this.password);
        identity.set(ret);
        window.location.reload();
      } catch (err) {
        console.log(err);
        this.$Notice.error({
          title: "Failed to register： " + err.toString()
        });
      }
    },
    isLogined() {
      return !identity.isExpired();
    }
  },
  created() {
    if (!identity.isExpired()) this.$router.push("/");
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