<template>
    <div id="course">
        <h1>
            {{course.name}}
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="edit" @click="renameCourseModal = true"></Button>
            </Tooltip>
            <Tooltip placement="top" content="发布该课程" v-if="course.status === 0">
                <Button type="text" shape="circle" size="small" icon="information-circled" @click="publishCourse"></Button>
            </Tooltip>
            <Tooltip placement="top" content="已发布" v-show="course.status == 1">
                <Button type="text" shape="circle" size="small">
                    <Icon type="checkmark-circled" color="green"></Icon>
                </Button>
            </Tooltip>
    
        </h1>
        <div id="course-description">
            <i>{{course.description}}</i>
            <Tooltip placement="top" content="修改名称">
                <Button type="text" shape="circle" size="small" icon="edit" @click="updateCourseDescriptionModal = true"></Button>
            </Tooltip>
        </div>
        <div class="layout-chapter" v-for="(ch, index) in chapters" :key="ch.id">
            <h2>
                {{ch.name}}
                <RenameChapter :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="修改名称">
                        <Button type="text" shape="circle" size="small" icon="edit"></Button>
                    </Tooltip>
                </RenameChapter>
                <UpdateChapterDescription :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="编辑简介">
                        <Button type="text" shape="circle" size="small" icon="ios-lightbulb"></Button>
                    </Tooltip>
                </UpdateChapterDescription>
                <AdjustChapterSeq :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="调整次序">
                        <Button type="text" shape="circle" size="small" icon="ios-settings-strong"></Button>
                    </Tooltip>
                </AdjustChapterSeq>
                <DeleteChapter :chapter="ch" @ok="getCourse">
                    <Tooltip placement="top" content="删除章节">
                        <Button type="text" shape="circle" size="small" icon="trash-b"></Button>
                    </Tooltip>
                </DeleteChapter>
            </h2>
            <div class="layout-section">
                <Card class="layout-section-item" v-for="s in ch.sections" :key="s.id">
                    {{s.name}}
                    <Tooltip placement="right" content="已发布" v-show="s.status === 1">
                        <Icon type="checkmark-circled" color="green" v-if="s.status === 1"></Icon>
                    </Tooltip>
                    <RenameSection :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="修改名称">
                            <Button type="text" shape="circle" size="small" icon="edit"></Button>
                        </Tooltip>
                    </RenameSection>
                    <UpdateSectionDescription :section="s" @ok="getCourse">
                        <Tooltip placement="top" content="编辑简介">
                            <Button type="text" shape="circle" size="small" icon="ios-lightbulb"></Button>
                        </Tooltip>
                    </UpdateSectionDescription>
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
import _ from 'lodash'
import course from '@/api/course'
import RenameCourseModal from './RenameCourseModal'
import UpdateCourseDescriptionModal from './UpdateCourseDescriptionModal'
import CreateChapterModal from './CreateChapterModal'
import RenameChapter from './RenameChapter'
import UpdateChapterDescription from './UpdateChapterDescription'
import AdjustChapterSeq from './AdjustChapterSeq'
import DeleteChapter from './DeleteChapter'
import CreateSectionModal from './CreateSectionModal'
import RenameSection from './RenameSection'
import UpdateSectionDescription from './UpdateSectionDescription'

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
                ch['sections'] = data.sections.filter(s => s.chapter_id === ch.id)
                return ch
            })
        },
        publishCourse() {
            this.$Modal.confirm({
                title: '发布确认',
                content: `<p>确定发布该课程<span style="color:red"> { ${this.course.name} } </span>？</p>`,
                loading: true,
                onOk: async () => {
                    let ret = await course.publishCourse(this.course.id)
                    await this.getCourse()
                    this.$Modal.remove()
                }
            })
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
        UpdateSectionDescription
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