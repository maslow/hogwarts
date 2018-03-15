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
          <Col><span class="label">验证码</span></Col>
          <Col span="6">
            <Input v-model="captcha_text" type="text"/>
          </Col>
          <Col span="12">
            <div class="captcha" @click="getCaptcha" v-html="captcha.data"></div>
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
import user from "./../api/user";
import identity from "@/api/identity.js";
import validator from "validator";
import md5 from "blueimp-md5";

export default {
  name: "signup",
  data() {
    return {
      email: "",
      password: "",
      password_repeat: "",
      captcha_text: null,
      captcha: {}
    };
  },
  methods: {
    async login() {
      let msg = null;
      if (validator.isEmail(this.email) === false)
        return this.$Notice.error({ title: "邮箱格式不正确" });

      if (!this.password) return this.$Notice.error({ title: "密码不能为空" });

      if (this.password.length < 6 || this.password.length > 18)
        return this.$Notice.error({ title: "密码长度不少于6, 不大于18" });

      if (this.password != this.password_repeat)
        return this.$Notice.error({ title: "两次密码不一致" });

      if (!this.captcha_text)
        return this.$Notice.error({ title: "验证码不为空" });

      if (this.captcha_text.length < 4)
        return this.$Notice.error({ title: "验证码不得低于4位" });

      if (msg) return this.$Notice.error({ title: msg });

      try {
        await user.Register(
          this.email,
          this.password,
          this.captcha_text,
          this.captcha.token
        );
        let ret = await user.Login(this.email, this.password);
        identity.set(ret);
        window.location.reload();
      } catch (err) {
        console.log(err);
        if (err.status === 422) {
          return this.$Notice.error({ title: err.responseText });
        }
        this.$Notice.error({
          title: "Failed to register： " + err.toString()
        });
      }
    },
    isLogined() {
      return !identity.isExpired();
    },
    async getCaptcha() {
      try {
        this.captcha = await user.captcha();
      } catch (error) {
        console.error(error);
      }
    }
  },
  async created() {
    if (this.isLogined()) return this.$router.push("/");
    await this.getCaptcha();
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

.captcha {
  margin-top: -5px;
  margin-left: 5px;
}
</style>