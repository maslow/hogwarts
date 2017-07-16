<template>
  <div class="courses">
    <Modal v-model="newCourse.modal" title="新建课程">
      <Form ref="newCourseForm" :model="newCourse.data" :rules="newCourse.rules" label-position="right" :label-width="80">
        <Form-item label="课程名称" prop="name">
            <Input v-model="newCourse.data.name"></Input>
        </Form-item>
        <Form-item label="课程介绍" prop="description">
            <Input v-model="newCourse.data.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="newCourse.loading" @click="createCourse">提交</Button> 
      </div>
    </Modal>

    <Button type="info" @click="newCourse.modal = true">新建课程</Button>
    <h1>课程列表</h1>
    <Row v-for="c in courses" :key="c.id">
      <Col span="12">
        <br/>
        <Card>
          <p slot="title">{{c.name}}
          </p>
          <div>
              <Tag type="dot" color="green" v-if="c.status === 1">已发布</Tag>
              <Button v-if="c.status === 0">发布</Button>
              <Button type="info">编辑</Button>
              <p>{{c.description}}</p>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import course from '@/api/course'

export default {
  name: 'user-courses',
  data () {
    return {
      courses: [],
      newCourse:{
        data: {
          name: "",
          description: ""
        },
        modal: false,
        loading: false,
        rules: {
          name: [
            { required: true, message: '课程名不可为空', trigger: 'blur' }
          ],
          description : [
            { required: true, message: '请输入课程简介', trigger: 'blur' },
            { type: 'string', min: 10, message: '介绍不能少于10字', trigger: 'blur' }
          ]
        }
      },
    }
  },
  async mounted () {
    let data = await course.getUserCourses()
    this.courses = data
  },
  methods: {
    createCourse () {
      this.$refs['newCourseForm'].validate(async valid => {
        if (!valid)  return ;
        this.newCourse.loading = true
        let rets = await course.createCourse(this.newCourse.data)
        this.$Message.success('提交成功!');
        this.newCourse.modal = false
        this.newCourse.data.name = ''
        this.newCourse.data.description = ''
        this.newCourse.loading = false
        let data = await course.getUserCourses()
        this.courses = data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
