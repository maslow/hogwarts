<template>
  <div class="courses">  
    <Row v-for="c in courses" :key="c._id">
      <Col span="6">
      <br/>
      <Card>
        <div slot="title">
          <router-link :to="'/course/' + c._id">{{c.name}}</router-link>
        </div>
        <div>
          <p class="course-description">
            {{c.desc}}
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
.course-description {
  color: #666;
  font-size: 14px;
}
</style>
