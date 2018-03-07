<template>
    <Poptip v-model="show" placement="right" title="删除确认?" width="200" @on-popper-hide="close">
        <slot></slot>
        <div slot="content" class="layout">
            <Button type="ghost" @click="close">取消</Button>
            <Button type="error" @click="ok">确定删除</Button>
            <div style="color:green" v-if="loading">Deleting ...</div>
        </div>
    </Poptip>
</template>

<script>
import course from "@/api/course";

export default {
  name: "delete-section",
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false,
      loading: false
    };
  },
  methods: {
    async ok() {
      if (this.section.status !== "unpublished") {
        this.$Notice.info({
          title: "不能进行该操作",
          desc: "已发布或锁定状态下，不能进行删除操作，请先下架该小节"
        })
        return;
      }
      this.loading = true;
      try {
        const data = await course.deleteSection(this.section._id);
        this.$emit("ok", data);
        this.show = false;
        this.$Notice.success({
          title: "删除小节成功!"
        });
      } catch (err) {
        console.error(err);
        this.$emit("err", err);
        this.$Notice.error({
          title: "操作失败",
          desc: err.toString()
        });
      }
      this.loading = false;
    },
    close() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.layout {
  padding: 5px;
}
</style>
