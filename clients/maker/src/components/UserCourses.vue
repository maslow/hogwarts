<template>
  <div class="courses">
    <h1>课程列表</h1>
     <Row v-for="c in courses" :key="c.id">
      <Col span="12">
        <br/>
        <Card>
          <div slot="title">{{c.name}}
              <Tag type="dot" color="green" v-if="c.status === 1">已发布</Tag>
              <Tag type="dot" color="yellow" v-if="c.status === 0">未发布</Tag>
          </div>
          <p>{{c.description}}</p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'user-courses',
  data () {
    return {
      courses: []
    }
  },
  created () {
    this.courses = [
        {
          id: 1,
          name: 'Course 1',
          description: 'This is description',
          status: 0
        },
        {
          id: 2,
          name: 'Course 2',
          description: 'This is description',
          status: 1
        },
        {
          id: 3,
          name: 'Course 3',
          description: 'This is description',
          status: 0
        },
        {
          id: 4,
          name: 'Course 4',
          description: 'This is description',
          status: 1
        },
      ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
