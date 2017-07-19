<template>
    <div id="course">
        <h1>{{course.name}}</h1>
        <br/>
        <Button type="warning" size="small" @click="publishCourse()" v-if="course.status === 0">发布课程</Button>
        <Button type="ghost" size="small" @click="renameCourseModal = true">修改课程名</Button>
        <Button type="ghost" size="small" @click="updateCourseDescriptionModal = true">编辑课程简介</Button>
        <Button type="error" size="small" disabled>删除课程</Button>
        <div id="course-description">
            <i>{{course.description}}</i>
        </div>
        <div class="layout-chapter" v-for="(ch, index) in chapters" :key="ch.id">
            <h2>{{ch.name}}</h2>
            <div class="layout-section">
                <Collapse accordion>
                    <Panel v-for="s in sections.filter(it => it.chapter_id == ch.id)" :key="s.id">
                        {{s.name}}
                        <Tooltip placement="right" :content="s.status === 1 ? '已发布' : '未发布'">
                            <Icon type="checkmark-circled" color="green" v-if="s.status === 1"></Icon>
                            <Icon type="information-circled" color="#ff9900" v-if="s.status === 0"></Icon>
                        </Tooltip>
                        <div slot="content">
                            <p>{{s.description}}</p>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div>
        <br/>
        <Affix :offset-bottom="20">
            <Button type="info" size="small">添加新章节</Button>
            <Button type="success" size="small">添加新小节</Button>
        </Affix>
    
        <!-- Modals -->
        <RenameCourseModal v-model="renameCourseModal" :course="course" @ok="getCourse"></RenameCourseModal>
        <UpdateCourseDescriptionModal v-model="updateCourseDescriptionModal" :course="course" @ok="getCourse"></UpdateCourseDescriptionModal>
    </div>
</template>


<script>
import course from '@/api/course'
import RenameCourseModal from './RenameCourseModal'
import UpdateCourseDescriptionModal from './UpdateCourseDescriptionModal'

export default {
    data() {
        return {
            courseId: this.$route.params.id,
            course: {},
            chapters: [],
            sections: [],
            renameCourseModal: false,
            updateCourseDescriptionModal: false,
        }
    },
    async created() {
        this.getCourse()
    },
    methods: {
        async getCourse() {
            let data = await course.getCourse(this.courseId)
            this.course = data.course
            this.chapters = data.chapters
            this.sections = data.sections
        },
        publishCourse() {
            this.$Modal.confirm({
                title: '发布确认',
                content: `<p>确定发布该课程<span style="color:red"> { ${this.course.name} } </span>？</p>`,
                loading: true,
                onOk: async () => {
                    let ret = await course.publishCourse(this.course.id)
                    this.course = ret
                    this.$Modal.remove()
                }
            })
        }
    },
    components: {
        RenameCourseModal,
        UpdateCourseDescriptionModal
    }
}
</script>
    
<style scoped>
h1,
h2 {
    font-weight: normal;
}

#course-description {
    margin-left: 17px;
    color: #666;
    margin-top: 20px;
    padding: 3px;
    border-left: 4px solid lightgray;
}

.layout-chapter {
    width: 600px;
    margin: 25px 15px;
}

.layout-section {
    margin: 5px 5px;
}
</style>