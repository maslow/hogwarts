<template>
    <div class="layout">
        <Menu mode="horizontal" theme="light" active-name="/" @on-select="onSelect">
            <div class="layout-logo">
            </div>
            
            <div class="layout-nav">
              <Menu-item name="/courses">
                <Icon type="flag"></Icon>
                    训练营
              </Menu-item>
              <Menu-item name="/logout"  v-if="isLogined">
                    <Icon type="ios-analytics"></Icon>
                    退出登录
              </Menu-item>
              <Menu-item name="/login"  v-if="!isLogined">
                    <Icon type="ios-analytics"></Icon>
                    登录
              </Menu-item>
            </div>
        </Menu>
        <div style="clear:both;"></div>
        <div class="layout-content">
            <transition mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <div class="layout-copy">
            （内测）2018 &copy; step8step.com  &nbsp;&nbsp;
            <b style="color:darkcyan">反馈讨论QQ群：603059673</b>
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
        this.$router.push("/login");
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
      if (this.isLogined) 
        await User.validateToken();
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
.layout-logo::after {
  clear: both;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
}

.layout-content {
  z-index: 999;
  min-height: 500px;
  margin: 0;
  background: #fefefe;
  border-radius: 4px;
  padding: 0;
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