<template>
    <div id="course">
        <div>
            <span class="course-name">{{course.name}}</span>
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="compose" @click="renameCourseModal = true"></Button>
            </Tooltip>
            <DeleteCourse :course="course" @ok="afterDeleteCourse">
                <Tooltip placement="top" content="删除课程">
                    <Button type="text" shape="circle" size="small">
                        <Icon type="trash-b" color="#80848f"></Icon>
                    </Button>
                </Tooltip>
            </DeleteCourse>
            <i-switch size="large" v-model="course.status" @on-change="handlePublishCourse" true-value="published" false-value="unpublished">
                <span slot="open">发布</span>
                <span slot="close">下架</span>
            </i-switch>
        </div>
        <div id="course-description">
            <i>{{course.desc}}</i>
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="compose" @click="updateCourseDescriptionModal = true"></Button>
            </Tooltip>
        </div>

        <!-- chapters -->
        <div class="layout-chapter" v-for="ch in chapters" :key="ch._id">
            <h2>
                <span class="chapter-name">{{ch.name}}</span>
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
                        <Icon type="locked" color="lightgray"></Icon>&nbsp;
                    </Tooltip>
                    <span class="section-name">{{s.name}}</span>
                    <RenameSection :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="修改名称">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="compose" color="#2d8cf0"></Icon>
                                名称
                            </Button>
                        </Tooltip>
                    </RenameSection>
                    <UpdateSectionDescription :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="编辑简介">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="quote" color="#5cadff"></Icon>
                                简介
                            </Button>
                        </Tooltip>
                    </UpdateSectionDescription>
                    <AdjustSectionSeq :section="s" @ok="getCourse">
                        <Tooltip placement="top" :content="`调整次序 [${s.sequence}]`">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="ios-settings-strong" color="#3091f2"></Icon>
                                {{`次序`}}
                            </Button>
                        </Tooltip>
                    </AdjustSectionSeq>
                    <Tooltip placement="top" content="初始代码">
                        <router-link :to="'/section-codes/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="code" color="#ff9900"></Icon>
                                初始代码
                            </Button>
                        </router-link>
                    </Tooltip>
                    <Tooltip placement="top" content="测试用例">
                        <router-link :to="'/section-tests/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="bug" color="#19be6b"></Icon>
                                测试用例
                            </Button>
                        </router-link>
                    </Tooltip>
                    <Tooltip placement="top" content="任务文档">
                        <router-link :to="'/section-docs/' + s._id">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="flag" color="#ed3f14"></Icon>
                                任务文档
                            </Button>
                        </router-link>
                    </Tooltip>
                    <DeleteSection :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="删除小节">
                            <Button type="text" shape="circle" size="small">
                                <Icon type="trash-b" color="#80848f"></Icon>
                                删除小节
                            </Button>
                        </Tooltip>
                    </DeleteSection>
                    <i-switch size="large" :value="s.status === 'published'? 'published' : 'unpublished'" @on-change="state => handlePublishSection(state,s)" true-value="published" false-value="unpublished">
                        <span slot="open">发布</span>
                        <span slot="close">{{s.status === 'locked'? '锁定':'下架'}}</span>
                    </i-switch>
                </Card>
            </div>
        </div><!-- end of chapters -->
        
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
import DeleteCourse from "@/components/DeleteCourse";
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
          await course.unpublishSection(section._id);
          await this.getCourse();
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
    },
    afterDeleteCourse() {
      this.$Modal.success({
        title: "课程已删除",
        content: "页面即将跳转至课程列表页面",
        onOk: () => {
          this.$router.push('/')
        }
      });
    }
  },
  components: {
    DeleteCourse,
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

.layout-chapter {
  width: 900px;
  margin: 25px 30px;
}

.layout-section {
  margin: 5px 45px;
}

.layout-section-item {
  margin-top: 5px;
}
#course-description {
  margin-left: 30px;
  color: rgb(80, 77, 77);
  margin-top: 20px;
  padding-left: 5px;
  font-size: 13px;
  border-left: 2px solid rgb(224, 222, 222);
  font-weight: 300;
}

.course-name{
    color: #01202b;
    font-size: 26px;
    font-weight: 300;
    border: 1px solid rgb(229, 227, 227);
    margin-left: 28px;
    padding:1px 5px;
    box-shadow: -2px 5px 10px rgb(216, 213, 213);
    border-radius: 4px;
}

.chapter-name {
    color: rgb(21, 126, 120);
    font-weight: 300;
    font-size: 20px;
    border: 1px solid lightblue;
    box-shadow: -4px -2px 1px lightblue;
    border-radius: 3px;
    padding: 1px;
}

.section-name {
    color: rgb(6, 44, 6);
    font-weight: 400;
    font-size: 14px;
    padding: 1px 3px; 
    box-shadow: -1px 1px 50px rgba(215, 226, 215, 0.452);
    border: 1px solid rgba(235, 237, 238, 0.808);
    background: rgba(235, 237, 238, 0.808);
    border-radius: 6px;
}
</style>