<template>
    <div class="layout">
        <Menu mode="horizontal" theme="dark" active-name="/" @on-select="onSelect">
            <div class="layout-logo"></div>
            <div class="layout-nav" v-if="isLogined">
                <Menu-item name="/courses">
                    <Icon type="flag"></Icon>
                    我的作品
                </Menu-item>
                <Menu-item name="/guide">
                    <Icon type="ios-analytics"></Icon>
                    指南
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
import identity from '@/api/identity'

export default {
    name: 'app',
    data() {
        return {
        }
    },
    methods: {
        onSelect(name) {
            if(name === '/logout'){
                identity.clear()
                return window.location.reload()
            }
            this.$router.push(name)
        }
    },
    computed: {
        isLogined(){
            return !identity.isExpired()
        }
    }
}
</script>

<style scoped>
.layout {
    font-size: 18px;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
}

.layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
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