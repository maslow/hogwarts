<template>
    <div id="course">
        <h1>{{course.name}}</h1>
        <br/>
        <ButtonGroup>
            <Button type="warning" size="small" @click="publishCourse(course)" v-if="course.status === 0">发布课程</Button>
            <Button type="info" size="small">修改课程名</Button>
            <Button type="ghost" size="small">编辑课程简介</Button>
            <Button type="error" size="small">删除课程</Button>
        </ButtonGroup>
        <br/>
        <div class="chapter-layout" v-for="(ch, index) in chapters" :key="ch.id">
            <h2>{{ch.name}}</h2>
            <div class="section-layout">
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
    </div>
</template>

<script>
import course from '@/api/course'

export default {
    data() {
        return {
            courseId: this.$route.params.id,
            course: {},
            chapters: [],
            sections: []
        }
    },
    async created() {
        let data = await course.getCourse(this.courseId)
        this.course = data.course
        this.chapters = data.chapters
        this.sections = data.sections
    },
    methods: {
        publishCourse(c) {
            this.$Modal.confirm({
                title: '发布确认',
                content: `<p>确定发布该课程<span style="color:red"> { ${c.name} } </span>？</p>`,
                loading: true,
                onOk: async () => {
                    await course.publishCourse(c.id)
                    this.$Modal.remove();
                    this.$Message.success('发布成功！');
                }
            });
        }
    }
}
</script>
    
<style scoped>
h1,
h2 {
    font-weight: normal;
}

.chapter-layout {
    width: 600px;
    margin: 30px 10px;
}

.section-layout {
    margin: 5px 5px;
}
</style>