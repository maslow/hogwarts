<template>
  <div class="home">
    <div id="particle">
      <vue-particles color="#dedede"></vue-particles>
    </div>
    <h1>大神</h1>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: lighter;
  line-height: 600px;
  font-size: 40px;
  text-align: center;
}

.home {
  min-height: 700px;
}

#particle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
