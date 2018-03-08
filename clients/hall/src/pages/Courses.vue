<template>
  <div class="courses">  
    <Row type="flex":gutter="20" justify="start">
      <Col class="course-col" span="8" v-for="c in courses" :key="c._id">
      <Card>
        <div slot="title">
          <router-link class="course-name" :to="'/course/' + c._id">{{c.name}}</router-link>
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
  async created() {
    await this.getCourses()
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
.courses{
  padding: 20px;
}

.course-col{
  margin-bottom: 20px;
}

.course-name{
  font-size: 18px;
  color: lightseagreen
}
.course-description {
  font-weight: 300;
  font-size: 15px;
  min-height: 100px;
}
</style>
