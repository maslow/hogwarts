<template>
    <div id="course">
        <div class="course-name">
            {{course.name}}    
        </div>
        <div id="course-description">
            <i>{{course.desc}}</i>
        </div>
        <div class="layout-chapter" v-for="ch in chapters" :key="ch._id">
            <span class="chapter-name">
                {{ch.name}}
            </span>
            <div class="layout-section">
                <Card class="layout-section-item" v-for="s in ch.sections" :key="s._id">
                    <span v-if="isLogined()">
                        <Tooltip content="已通过!" placement="top" v-if="s.job_status === 'success'">
                          <Icon type="flag" color="green"></Icon>
                        </Tooltip>
                        <Tooltip content="未通过" placement="top" v-if="s.job_status === 'failed'">
                          <Icon type="flag" color="red"></Icon>
                        </Tooltip>
                    </span>

                    <Tooltip content="未开始" placement="top" v-if="!s.job_status || s.job_status === 'created'">
                          <Icon type="flag" color="lightgray"></Icon>
                    </Tooltip>

                    <router-link :to="'/job/' + s._id" class="section-name" v-if="isLogined()">{{s.name}}</router-link>
                    <a v-if="!isLogined()">
                        <Tooltip placement="top" content="用户登陆后进行该操作">
                          <span class="section-name">{{s.name}}</span>
                        </Tooltip>
                    </a>
                    <div class="section-description">
                        <i>{{s.desc}}</i>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>


<script>
import _ from "lodash";
import course from "@/api/course";
import JobAPI from "@/api/job";
import identity from "@/api/identity";

export default {
  data() {
    return {
      courseId: this.$route.params.id,
      course: {},
      chapters: []
    };
  },
  async created() {
    await this.getCourse();
  },
  methods: {
    async getJobState(sectionId) {
      if (!this.isLogined()) return null;
      try {
        const job = await JobAPI.getUserJobBySectionId(sectionId);
        return job.status;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    async getCourse() {
      let data = await course.getCourse(this.courseId);
      this.course = data.course;
      data.chapters = _.sortBy(data.chapters, ["sequence", "created_at"]);

      this.chapters = data.chapters.map(ch => {
        let sections = data.sections.filter(s => s.chapter_id === ch._id);
        sections = sections.map(section => {
          section["job_status"] = null;
          return section;
        });
        ch["sections"] = _.sortBy(sections, ["sequence", "created_at"]);
        return ch;
      });
      // update section-job status, asychronously
      this.chapters.forEach(ch => {
        ch.sections.forEach(async section => {
          const status = await this.getJobState(section._id);
          section.job_status = status;
        });
      });
    },
    isLogined() {
      return !identity.isExpired();
    }
  },
  components: {}
};
</script>
    
<style scoped>
h1,
h2 {
  font-weight: normal;
}

.course-name {
  color: rgb(21, 143, 137);
  font-size: 28px;
  font-weight: 300;
  border: 1px solid rgb(153, 213, 213);
  margin: -565px -9px;
  margin-bottom: 0px;
  height: 600px;
  width: 1200px;
  padding: 555px 35px 0px;
  text-align: left;
  box-shadow: -300px 30px 50px rgb(204, 202, 202);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 450px;
}

.chapter-name {
  color: rgb(21, 126, 120);
  font-weight: 300;
  font-size: 20px;
  border: 1px solid rgb(210, 230, 238);
  box-shadow: -3px 0px 0px rgb(186, 221, 233);
  border-radius: 3px;
  padding: 1px;
}
.section-name {
  color: rgb(6, 44, 6);
  font-weight: 400;
  font-size: 15px;
  margin-left: 5px;
  padding: 1px 8px;
  box-shadow: -2px 1px 1px rgb(215, 226, 215);
  border: 1px solid rgba(198, 200, 201, 0.997);
  background: rgba(235, 237, 238, 0.808);
}

.section-name:hover{
  color: rgb(6, 44, 6);
  font-weight: 400;
  font-size: 15px;
  margin-left: 5px;
  padding: 1px 8px;
  box-shadow: -2px 1px 2px rgb(215, 226, 215);
  border: 1px solid lightblue;
  background: rgb(235, 237, 238);
  border-radius: 3px 3px 3px 3px;
}

#course-description {
  margin-left: 30px;
  color: rgb(80, 77, 77);
  margin-top: 20px;
  padding-left: 5px;
  font-size: 14px;
  border-left: 2px solid rgb(224, 222, 222);
  font-weight: 300;
}

.layout-chapter {
  width: 900px;
  margin: 25px 30px;
}

.layout-section {
  margin: 5px 20px;
}

.layout-section-item {
  margin-top: 5px;
}

.section-description {
  /* margin-left: 10px; */
  margin-top: 10px;
  color: #666;
  font-size: 12px;
}
</style>