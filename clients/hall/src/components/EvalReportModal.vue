<template>
  <Modal v-model="show_internal" title="Result">
    <div v-if="reports.ok" style="color: green;text-align:center;font-size: 30px;">
            恭喜通过！
    </div>
    <div v-if="!reports.ok" style="color: #dc871d; text-align:center;font-size: 30px;">
            FAILED
    </div>
    <br/>
    <div v-if="!reports.ok" style="padding-left: 30px;padding-right: 30px;">
        <div style="font-size: 16px;" v-html="message"></div>
        <br />
        <p style="color: red;" v-if="show_detail" v-html="stack"></p>
    </div>
    <div slot="footer">
        <Button type="info" @click="detail" v-if="!reports.ok">查看详细</Button>
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
    }
  },
  methods: {
    detail(){
        this.show_detail = !this.show_detail
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
    message: {
        get: function(){
            if(!this.reports.ok)
                return this.reports.tests[0].err.message.replace(/\n/g, '<br/>')
        }
    },
    stack:{
        get: function(){
            if(!this.reports.ok)
                return this.reports.tests[0].err.stack.replace(/\n/g, '<br/>')
        }
    }
  }
};
</script>

<style>

</style>
