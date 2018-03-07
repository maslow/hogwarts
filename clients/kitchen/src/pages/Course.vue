<template>
    <div id="course">
        <h1>
            {{course.name}}
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="compose" @click="renameCourseModal = true"></Button>
            </Tooltip>
            <!-- <Tooltip placement="top" content="发布该课程" v-if="course.status === 'unpublished'">
                <Button type="text" shape="circle" size="small" icon="information-circled" @click="publishCourse"></Button>
            </Tooltip> -->
            <Tooltip placement="top" content="已发布" v-show="course.status == 'published'">
                <Button type="text" shape="circle" size="small">
                    <Icon type="checkmark-circled" color="green"></Icon>
                </Button>
            </Tooltip>
            <i-switch size="large" v-model="course.status" @on-change="handlePublishCourse" true-value="published" false-value="unpublished">
                <span slot="open">发布</span>
                <span slot="close">下架</span>
            </i-switch>
        </h1>
        <div id="course-description">
            <i>{{course.desc}}</i>
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="compose" @click="updateCourseDescriptionModal = true"></Button>
            </Tooltip>
        </div>
        <div class="layout-chapter" v-for="ch in chapters" :key="ch._id">
            <h2>
                {{ch.name}}
                <RenameChapter :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="修改名称">
                        <Button type="text" shape="circle" size="small">
                            <Icon type="compose" color="#80848f"></Icon>
                        </Button>
                    </Tooltip>
                </RenameChapter>
                <UpdateChapterDescription :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="编辑简介">
                        <Button type="text" shape="circle" size="small">
                            <Icon type="quote" color="#80848f"></Icon>
                        </Button>
                    </Tooltip>
                </UpdateChapterDescription>
                <AdjustChapterSeq :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="调整次序">
                        <Button type="text" shape="circle" size="small">
                            <Icon type="ios-settings-strong" color="#80848f"></Icon>
                        </Button>
                    </Tooltip>
                </AdjustChapterSeq>
                <DeleteChapter :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="删除章节">
                        <Button type="text" shape="circle" size="small">
                            <Icon type="trash-b" color="#80848f"></Icon>
                        </Button>
                    </Tooltip>
                </DeleteChapter>
            </h2>
            <div class="layout-section">
                <Card class="layout-section-item" v-for="s in ch.sections" :key="s._id">
                    <Tooltip placement="top" content="已发布" v-show="s.status === 'published'">
                        <Icon type="checkmark-circled" color="green"></Icon>
                    </Tooltip>
                    <Tooltip placement="top" content="锁定中" v-show="s.status === 'locked'">
                        <Icon type="locked" color="#bc0808"></Icon>&nbsp;
                    </Tooltip>
                    {{s.name}}
                    <RenameSection :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="修改名称">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="compose" color="#2d8cf0"></Icon>
                            </Button>
                        </Tooltip>
                    </RenameSection>
                    <UpdateSectionDescription :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="编辑简介">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="quote" color="#5cadff"></Icon>
                            </Button>
                        </Tooltip>
                    </UpdateSectionDescription>
                    <AdjustSectionSeq :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="调整次序">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="ios-settings-strong" color="#3091f2"></Icon>
                            </Button>
                        </Tooltip>
                    </AdjustSectionSeq>
                    <Tooltip placement="top" content="初始代码">
                        <router-link :to="'/section-codes/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="code" color="#ff9900"></Icon>
                            </Button>
                        </router-link>
                    </Tooltip>
                    <Tooltip placement="top" content="测试用例">
                        <router-link :to="'/section-tests/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="bug" color="#19be6b"></Icon>
                            </Button>
                        </router-link>
                    </Tooltip>
                    <Tooltip placement="top" content="任务文档">
                        <router-link :to="'/section-docs/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="flag" color="#ed3f14"></Icon>
                            </Button>
                        </router-link>
                    </Tooltip>
                    <DeleteSection :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="删除小节">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="trash-b" color="#80848f"></Icon>
                            </Button>
                        </Tooltip>
                    </DeleteSection>
                    <i-switch size="large" :value="s.status === 'published'? 'published' : 'unpublished'" @on-change="state => handlePublishSection(state,s)" true-value="published" false-value="unpublished">
                        <span slot="open">发布</span>
                        <span slot="close">{{s.status === 'locked'? '锁定':'下架'}}</span>
                    </i-switch>
                </Card>
            </div>
        </div>
        <div class="layout-chapter">
            <Affix :offset-bottom="20">
                <Button type="info" size="small" icon="plus" @click="createChapterModal = true">添加新章节</Button>
                <Button type="ghost" size="small" icon="plus" @click="createSectionModal = true">添加新小节</Button>
            </Affix>
        </div>
    
        <!-- Modals -->
        <RenameCourseModal v-model="renameCourseModal" :course="course" @ok="getCourse"></RenameCourseModal>
        <UpdateCourseDescriptionModal v-model="updateCourseDescriptionModal" :course="course" @ok="getCourse"></UpdateCourseDescriptionModal>
        <CreateChapterModal v-model="createChapterModal" :course="course" @ok="getCourse"></CreateChapterModal>
        <CreateSectionModal v-model="createSectionModal" :course="course" :chapters="chapters" @ok="getCourse"></CreateSectionModal>
    </div>
</template>


<script>
import _ from "lodash";
import course from "@/api/course";
import RenameCourseModal from "@/components/RenameCourseModal";
import UpdateCourseDescriptionModal from "@/components/UpdateCourseDescriptionModal";
import CreateChapterModal from "@/components/CreateChapterModal";
import RenameChapter from "@/components/RenameChapter";
import UpdateChapterDescription from "@/components/UpdateChapterDescription";
import AdjustChapterSeq from "@/components/AdjustChapterSeq";
import DeleteChapter from "@/components/DeleteChapter";
import CreateSectionModal from "@/components/CreateSectionModal";
import RenameSection from "@/components/RenameSection";
import DeleteSection from "@/components/DeleteSection";
import UpdateSectionDescription from "@/components/UpdateSectionDescription";
import AdjustSectionSeq from "@/components/AdjustSectionSeq";

export default {
  data() {
    return {
      courseId: this.$route.params.id,
      course: {},
      chapters: [],
      renameCourseModal: false,
      updateCourseDescriptionModal: false,
      createChapterModal: false,
      createSectionModal: false
    };
  },
  async created() {
    await this.getCourse();
  },
  methods: {
    async getCourse() {
      let data = await course.getOwnCourse(this.courseId);
      this.course = data.course;
      data.chapters = _.sortBy(data.chapters, ["sequence", "created_at"]);
      this.chapters = data.chapters.map(ch => {
        let ss = data.sections.filter(s => s.chapter_id === ch._id);
        ch["sections"] = _.sortBy(ss, ["sequence", "created_at"]);
        return ch;
      });
    },
    async handlePublishCourse(state) {
      try {
        this.$Spin.show();
        if (state === "published") {
          await course.publishCourse(this.course._id);
          this.$Notice.success({
            title: `<i>${this.course.name}</i> <b>已发布！</b>`
          });
        } else {
          await course.unpublishCourse(this.course._id);
          this.$Notice.info({
            title: `<i>${this.course.name}</i> <b>已下架.</b>`
          });
        }
      } catch (err) {
        await this.getCourse();
        this.$Notice.error({
          title: "操作失败!",
          desc: err.toString()
        });
      }
      this.$Spin.hide();
    },
    async handlePublishSection(state, section) {
      try {
        this.$Spin.show();
        if (state === "published") {
          await course.publishSection(section._id);
          await this.getCourse();
          this.$Notice.success({
            title: `<i>${section.name}</i> <b>已发布！</b>`
          });
        } else {
          await this.getCourse();
          await course.unpublishSection(section._id);
          this.$Notice.info({
            title: `<i>${section.name}</i> <b>已下架！</b>`
          });
        }
      } catch (err) {
        await this.getCourse();
        this.$Notice.error({
          title: "操作失败!",
          desc: err.toString()
        });
        console.error(err);
      }
      this.$Spin.hide();
    }
  },
  components: {
    RenameCourseModal,
    UpdateCourseDescriptionModal,
    CreateChapterModal,
    RenameChapter,
    UpdateChapterDescription,
    AdjustChapterSeq,
    DeleteChapter,
    CreateSectionModal,
    RenameSection,
    DeleteSection,
    UpdateSectionDescription,
    AdjustSectionSeq
  }
};
</script>
    
<style scoped>
h1,
h2 {
  font-weight: normal;
}

#course-description {
  margin-left: 30px;
  color: #666;
  margin-top: 20px;
  padding: 3px;
  border-left: 4px solid lightgray;
}

.layout-chapter {
  width: 600px;
  margin: 25px 30px;
}

.layout-section {
  margin: 5px 45px;
}

.layout-section-item {
  margin-top: 5px;
}
</style>