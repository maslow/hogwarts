<template>
      <Menu mode="horizontal" active-name="/" @on-select="selectMenuItem">
        <Menu-item name="/hello">
            <Icon type="ios-paper"></Icon>
            内容管理
        </Menu-item>
        <Menu-item name="/">
            <Icon type="ios-people"></Icon>
            内容管理
        </Menu-item>
    </Menu>
</template>

<script>
export default {
  methods: {
    selectMenuItem: function (name) {
      this.$router.push(name)
    }
  }
}
</script>

<style>
    
</style>
