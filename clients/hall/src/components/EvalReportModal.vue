<template>
  <Modal v-model="show_internal" :width="ok?500:700" :closable="false" :mask-closable="false">
    <div v-if="ok" class="modal-header" style="color: #19be6b">
      恭喜通过
    </div>
    <div v-if="!ok" class="modal-header" style="color: rgb(144, 141, 146);">
      未通过
    </div>
    <div class="tests-list">
      <div class="test-item" v-for="test in tests">
        <div class="test-title">
          <Icon type="close-round" v-if="!test.passed" color="#ed3f14"></Icon>
          <Icon type="checkmark-round" v-if="test.passed" color="green"></Icon>          
          {{test.title}}   
        </div>
        <div class="test-err-detail" v-if="!test.passed">
          <pre class="err-message" v-html="test.err.message"></pre>
          <pre class="err-stack" v-if="show_detail" v-html="test.err.stack"></pre>
        </div>
      </div>
    </div>
    <div slot="footer">
        <Button type="info" @click="detail" v-if="!ok">查看详细</Button>
        <Button type="primary" @click="cancel">关闭</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  model: {
    prop: "_show",
    event: "close"
  },
  props: {
    _show: Boolean,
    reports: Object
  },
  data() {
    return {
      show_detail: false
    };
  },
  methods: {
    detail() {
      this.show_detail = !this.show_detail;
    },
    cancel() {
      this.show_internal = false;
    }
  },
  computed: {
    show_internal: {
      get: function() {
        return this._show;
      },
      set: function(v) {
        this.$emit("close", v);
      }
    },
    tests: {
      get: function() {
        if (this.reports) return this.reports.tests;
      }
    },
    message: {
      get: function() {
        if (this.reports && !this.reports.ok)
          return this.reports.tests[0].err.message; //.replace(/\n/g, '<br/>')
      }
    },
    stack: {
      get: function() {
        if (this.reports && !this.reports.ok)
          return this.reports.tests[0].err.stack; //.replace(/\n/g, '<br/>')
      }
    },
    ok: {
      get: function() {
        if (this.reports) return this.reports.ok;
        else return null;
      }
    }
  }
};
</script>

<style scoped>
.modal-header {
  text-align: center;
  font-size: 30px;
  font-weight: 300;
  margin-bottom: 20px;
  box-shadow: 0px 0px 15px lightgray;
}
.tests-list {
  padding-left: 20px;
}
.tests-list .test-item {
  margin-bottom: 10px;
}
.tests-list .test-item .test-title{
  font-size: 20px;
  font-weight: 200;
}
.tests-list .test-err-detail{
  margin-left: 21px;
  margin-top: 10px;
  padding: 5px;
  padding-left: 10px;
  border-left: 1px solid lightgray;
  border-radius: 5px;
}
.tests-list .test-err-detail pre.err-message{
  margin: 0;
  font-size: 14px;
  font-weight: 100;
  margin-bottom: 5px;
  color: #ed3f14;
  font-weight: 100;
}
.tests-list .test-err-detail pre.err-stack{
  margin: 0px;
  color: gray;
  font-weight: 100;
  font-size: 12px;
}
</style>
