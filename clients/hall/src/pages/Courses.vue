<template>
  <div class="courses">
    <h1>课程列表</h1>
    <br/>
  
    <Row v-for="c in courses" :key="c.id">
      <Col span="12">
      <br/>
      <Card>
        <div slot="title">
          <router-link :to="'/course/' + c.id">{{c.name}}</router-link>
        </div>
        <div>
          <p>
            {{c.description}}
          </p>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import course from '@/api/course'

export default {
  name: 'courses',
  data() {
    return {
      courses: []
    }
  },
  created() {
    this.getCourses()
  },
  methods: {
    async getCourses() {
      let data = await course.getPublishedCourses()
      this.courses = data
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>
