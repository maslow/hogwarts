<template>
  <div class="courses">
    <Button type="info" @click="modal = true">新建课程</Button>
    <h1>课程列表</h1>
    <Row v-for="c in courses" :key="c.id">
      <Col span="12">
      <br/>
      <Card>
        <p slot="title">{{c.name}}
        </p>
        <div>
          <Tag type="dot" color="green" v-if="c.status === 1">已发布</Tag>
          <Button v-if="c.status === 0" @click="publishCourse(c)">发布</Button>
          <Button type="info">编辑</Button>
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
  mounted() {
    this.getCourses()
  },
  methods: {
    async getCourses() {
      let data = await course.getUserCourses()
      this.courses = data
    },
    publishCourse(c) {
      this.$Modal.confirm({
        title: '删除确认',
        content: `<p>确定发布该课程<span style="color:red"> { ${c.name} } </span>？</p>`,
        loading: true,
        onOk: async () => {
          await course.publishCourse(c.id)
          this.$Modal.remove();
          this.$Message.success('发布成功！');
        }
      });
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
