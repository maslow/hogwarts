<template>
    <div class="layout">
        <Menu mode="horizontal" theme="dark" active-name="/" @on-select="onSelect">
            <div class="layout-logo">
            </div>
            <div class="layout-nav" v-if="isLogined">
                <Menu-item name="/courses">
                    <Icon type="flag"></Icon>
                    我的作品
                </Menu-item>
                <Menu-item name="/logout">
                    <Icon type="ios-analytics"></Icon>
                    退出登录
                </Menu-item>
            </div>
        </Menu>
        <div class="layout-content">
            <transition mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <div class="layout-copy">
            2016-2017 &copy; step8step.com
        </div>
    </div>
</template> 

<script>
import identity from "./api/identity";
import User from "./api/user";

export default {
  name: "app",
  data() {
    return {};
  },
  methods: {
    onSelect(name) {
      if (name === "/logout") {
        identity.clear();
        return window.location.reload();
      }
      this.$router.push(name);
    }
  },
  computed: {
    isLogined() {
      return !identity.isExpired();
    }
  },
  async mounted() {
    try {
      if (this.isLogined) {
        const result = await User.validateToken();
        const roles = result.roles;
        if (roles.indexOf("author") < 0) {
          this.$Modal.warning({
            title: "未认证用户",
            content:
              "抱歉，只有认证作者才可以访问课程制作系统，请联系管理员认证。",
            onOk: () => {
              identity.clear();
              return window.location.reload();
            }
          });
        }
      }
    } catch (err) {
      if (err.status && err.status == 401) {
        identity.clear();
      } else console.error(err);
    }
  }
};
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
}

.layout-logo {
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 15px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  background-image: url("./assets/wizard-hat.png");
  background-size: 80% 80%;
  background-repeat: no-repeat;
  background-position: center;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
}

.layout-content {
  z-index: 999;
  min-height: 200px;
  margin: 12px 3px;
  overflow: hidden;
  background: #fefefe;
  border-radius: 4px;
  padding: 8px;
  border: 1px solid whitesmoke;
  border-radius: 0px;
  box-shadow: 0 0 15px lightblue;
}

.layout-content-main {
  padding: 10px;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
</style>