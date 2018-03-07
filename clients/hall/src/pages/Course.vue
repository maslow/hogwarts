<template>
    <div id="course">
        <h1>
            {{course.name}}    
        </h1>
        <div id="course-description">
            <i>{{course.desc}}</i>
        </div>
        <div class="layout-chapter" v-for="ch in chapters" :key="ch._id">
            <h2 class="chapter-name">
                {{ch.name}}
            </h2>
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

                    <router-link :to="'/job/' + s._id" v-if="isLogined()">{{s.name}}</router-link>
                    <a v-if="!isLogined()" class="section-name">
                        <Tooltip placement="top" content="用户登陆后进行该操作">{{s.name}}</Tooltip>
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
      if(!this.isLogined())
        return null
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
          section["job_status"] = null
          return section
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

.chapter-name {
  color: lightseagreen;
  font-size: 20px;
}
.section-name {
  font-size: 16px;
}

#course-description {
  margin-left: 30px;
  color: #666;
  margin-top: 20px;
  padding: 3px;
  border-left: 4px solid lightgray;
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