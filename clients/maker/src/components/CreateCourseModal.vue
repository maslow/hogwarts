<template>
  <div id="create-course-modal">
    <Modal v-model="_show" title="新建课程">
      <Form ref="new-course-form" :model="data" :rules="rules" label-position="right" :label-width="80">
        <Form-item label="课程名称" prop="name">
          <Input v-model="data.name"></Input>
        </Form-item>
        <Form-item label="课程介绍" prop="description">
          <Input v-model="data.description" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="loading" @click="ok">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import course from '@/api/course'

let rules = {
  name: [
    { required: true, message: '课程名不可为空', trigger: 'blur' },
    { type: 'string', max: 64, message: '课程名不大于64字', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程简介', trigger: 'blur' },
    { type: 'string', min: 10, message: '课程简介不少于10字', trigger: 'blur' },
    { type: 'string', max: 255, message: '课程简介不大于255字', trigger: 'blur' }
  ]
}

export default {
  name: 'create-course-modal',
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
    _show: {
      get() {
        return this.show
      },
      set(v) {
        this.$emit('change', v)
      }
    }
  },
  methods: {
    ok() {
      this.$refs['new-course-form'].validate(async valid => {
        if (!valid) return;
        this.loading = true
        try {
          let rets = await course.createCourse(this.data)
          this.$Notice.success({
            title: '创建课程成功'
          })
          this.$emit('change', false)  // Close the modal
          this.data.name = ''
          this.data.description = ''
          this.loading = false
          this.$emit('ok', rets)
        } catch (err) {
          this.$emit('err', err)
        }
      })
    }
  }
}
</script>
    
<style scopded>

</style>