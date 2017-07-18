<template>
  <div class="courses">
    <h1>课程列表</h1>
    <br/>
    <Button type="ghost" size="small" color="gray" @click="modal = true">
      <Icon type="plus-round" color="gray"></Icon>
      新建课程
    </Button>
  
    <Row v-for="c in courses" :key="c.id">
      <Col span="12">
      <br/>
      <Card>
        <div slot="title">
          <Tooltip placement="top" :content="c.status === 1 ? '已发布' : '未发布'">
            <Icon type="checkmark-circled" color="green" v-if="c.status === 1"></Icon>
            <Icon type="information-circled" color="#ff9900" v-if="c.status === 0"></Icon>
          </Tooltip>
          <router-link :to="'/course/' + c.id">{{c.name}}</router-link>
        </div>
        <div>
          <p>{{c.description}}</p>
        </div>
      </Card>
      </Col>
    </Row>
  
    <!-- Modals -->
    <CreateCourseModal v-model="modal" @ok="getCourses"></CreateCourseModal>
  </div>
</template>

<script>
import course from '@/api/course'
import CreateCourseModal from './CreateCourseModal'

export default {
  name: 'user-courses',
  data() {
    return {
      courses: [],
      modal: false
    }
  },
  created() {
    this.getCourses()
  },
  methods: {
    async getCourses() {
      let data = await course.getUserCourses()
      this.courses = data
    }
  },
  components: {
    CreateCourseModal
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
