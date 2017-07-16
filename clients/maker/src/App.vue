<template>
    <div class="layout">
        <Menu mode="horizontal" theme="dark" active-name="/" @on-select="onSelect">
            <div class="layout-logo"></div>
            <div class="layout-nav">
                <Menu-item name="/">
                    <Icon type="ios-navigate"></Icon>
                    我的作品
                </Menu-item>
                <Menu-item name="/about">
                    <Icon type="ios-keypad"></Icon>
                    关于
                </Menu-item>
                <Menu-item name="/guide">
                    <Icon type="ios-analytics"></Icon>
                    指南
                </Menu-item>
            </div>
        </Menu>
        <div class="layout-content">
            <router-view></router-view>
        </div>
        <div class="layout-copy">
            2016-2017 &copy; step8step.com
        </div>
    </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
      onSelect (name){
        this.$router.push(name)
      }
  }
}
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
</style>