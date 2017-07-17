<template>
  <div id="create-course-modal">
    <Modal v-model="_show" title="新建课程" @on-cancel="cancel">
      <Form ref="new-course-form" :model="data" :rules="rules" label-position="right" :label-width="80">
        <Form-item label="课程名称" prop="name">
          <Input v-model="data.name"></Input>
        </Form-item>
        <Form-item label="课程介绍" prop="description">
          <Input v-model="data.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="loading" @click="createCourse">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import course from '@/api/course'

let rules = {
  name: [
    { required: true, message: '课程名不可为空', trigger: 'blur' },
    { type: 'string', max: 64, message: '介绍不大于64字', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程简介', trigger: 'blur' },
    { type: 'string', min: 10, message: '介绍不少于10字', trigger: 'blur' },
    { type: 'string', max: 255, message: '介绍不大于255字', trigger: 'blur' }
  ]
}

export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  props: ['show'],
  data() {
    return {
      data: {
        name: "",
        description: ""
      },
      loading: false,
      rules
    }
  },
  computed: {
    _show() {
      return this.show
    }
  },
  methods: {
    createCourse() {
      this.$refs['new-course-form'].validate(async valid => {
        if (!valid) return;
        this.loading = true
        try {
          let rets = await course.createCourse(this.data)
          this.$Message.success('提交成功!');
          this.$emit('change', false)  // Close the modal
          this.data.name = ''
          this.data.description = ''
          this.loading = false
          this.$emit('ok', rets)
        } catch (err) {
          this.$emit('err', err)
        }
      })
    },
    cancel() {
      this.$emit('change', false)
    }
  }
}
</script>
    
<style>

</style>