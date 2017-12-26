<template>
  <div class="courses">
    <h1>课程列表</h1>
    <br/>
    <Button type="ghost" size="small" color="gray" @click="createCourseModal = true">
      <Icon type="plus-round" color="gray"></Icon>
      新建课程
    </Button>
  
    <Row v-for="c in courses" :key="c._id">
      <Col span="12">
      <br/>
      <Card>
        <div slot="title">
          <Tooltip placement="top" :content="c.status === 1 ? '已发布' : '未发布'">
            <Icon type="checkmark-circled" color="green" v-if="c.status === 1"></Icon>
            <Icon type="information-circled" color="#ff9900" v-if="c.status === 0"></Icon>
          </Tooltip>
          <router-link :to="'/course/' + c._id">{{c.name}}</router-link>
          <Tooltip placement="top" content="修改名称">
            <Button type="text" shape="circle" size="small" icon="edit" @click="rename(c)"></Button>
          </Tooltip>
        </div>
        <div>
          <p>
            {{c.desc}}
            <Tooltip placement="top" content="编辑简介">
              <Button type="text" shape="circle" size="small" icon="edit" @click="updateDescription(c)"></Button>
            </Tooltip>
          </p>
        </div>
      </Card>
      </Col>
    </Row>
  
    <!-- Modals -->
    <CreateCourseModal v-model="createCourseModal" @ok="getCourses"></CreateCourseModal>
    <RenameCourseModal v-model="renameCourseModal" :course="course" @ok="getCourses"></RenameCourseModal>
    <UpdateCourseDescriptionModal v-model="updateCourseDescriptionModal" :course="course" @ok="getCourses"></UpdateCourseDescriptionModal>  
  </div>
</template>

<script>
import course from '@/api/course'
import CreateCourseModal from '@/components/CreateCourseModal'
import RenameCourseModal from '@/components/RenameCourseModal'
import UpdateCourseDescriptionModal from '@/components/UpdateCourseDescriptionModal'

export default {
  name: 'user-courses',
  data() {
    return {
      courses: [],
      course: {},
      renameCourseModal: false,
      updateCourseDescriptionModal: false,
      createCourseModal: false
    }
  },
  created() {
    this.getCourses()
  },
  methods: {
    async getCourses() {
      let data = await course.getUserCourses()
      this.courses = data
    },
    rename(c) {
      this.course = c
      this.renameCourseModal = true
    },
    updateDescription(c) {
      this.course = c
      this.updateCourseDescriptionModal = true
    }
  },
  components: {
    CreateCourseModal,
    RenameCourseModal,
    UpdateCourseDescriptionModal
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
