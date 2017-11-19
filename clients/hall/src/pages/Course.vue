<template>
    <div id="course">
        <h1>
            {{course.name}}    
        </h1>
        <div id="course-description">
            <i>{{course.description}}</i>
        </div>
        <div class="layout-chapter" v-for="(ch, index) in chapters" :key="ch.id">
            <h2>
                {{ch.name}}
            </h2>
            <div class="layout-section">
                <Card class="layout-section-item" v-for="s in ch.sections" :key="s.id">
                    <router-link :to="'/job/' + s.id">{{s.name}}</router-link>
                </Card>
            </div>
        </div>
    </div>
</template>


<script>
import _ from 'lodash'
import course from '@/api/course'

export default {
    data() {
        return {
            courseId: this.$route.params.id,
            course: {},
            chapters: [],
        }
    },
    async created() {
        this.getCourse()
    },
    methods: {
        async getCourse() {
            let data = await course.getCourse(this.courseId)
            this.course = data.course
            data.chapters = _.sortBy(data.chapters, ['seq', 'created_at'])
            this.chapters = data.chapters.map(ch => {
                let ss = data.sections.filter(s => s.chapter_id === ch.id)
                ch['sections'] = _.sortBy(ss, ['seq', 'created_at'])
                return ch
            })
        }
    },
    components: {
    }
}
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