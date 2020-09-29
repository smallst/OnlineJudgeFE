<template>
  <Panel shadow :padding="10">
    <div slot="title">
      {{title}}
    </div>
    <div slot="extra">
      <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading">{{$t('m.Refresh')}}</Button>
      <Button v-else type="ghost" icon="ios-undo" @click="goBack">{{$t('m.Back')}}</Button>
    </div>

    <transition-group name="course-animate" mode="in-out">
      <div class="no-course" v-if="!courses.length" key="no-course">
        <p>{{$t('m.No_Courses')}}</p>
      </div>
      <template v-if="listVisible">
        <ul class="courses-container" key="list">
          <li v-for="course in courses" :key="course.title">
            <div class="flex-container">
              <div class="title"><a class="entry" @click="goCourse(course)">
                {{course.title}}</a></div>
              <div class="date">{{course.create_time | localtime }}</div>
              <div class="creator"> {{$t('m.By')}} {{course.created_by.username}}</div>
            </div>
          </li>
        </ul>
        <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getCourseList">
        </Pagination>
      </template>

      <template v-else>
        <div v-katex v-html="course.content" key="content" class="content-container markdown-body"></div>
      </template>
    </transition-group>
  </Panel>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'Courses',
    components: {
      Pagination
    },
    data () {
      return {
        limit: 10,
        total: 10,
        btnLoading: false,
        courses: [],
        course: '',
        listVisible: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        if (this.isContest) {
          this.getContestCourseList()
        } else {
          this.getCourseList()
        }
      },
      getCourseList (page = 1) {
        this.btnLoading = true
        api.getCourseList((page - 1) * this.limit, this.limit).then(res => {
          this.btnLoading = false
          this.courses = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestCourseList () {
        this.btnLoading = true
        api.getContestCourseList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.courses = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goCourse (course) {
        this.course = course
        this.listVisible = false
      },
      goBack () {
        this.listVisible = true
        this.course = ''
      }
    },
    computed: {
      title () {
        if (this.listVisible) {
          return this.$i18n.t('m.Courses')
        } else {
          return this.course.title
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>

<style scoped lang="less">
  .courses-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      padding-top: 15px;
      list-style: none;
      padding-bottom: 15px;
      margin-left: 20px;
      font-size: 16px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      &:last-child {
        border-bottom: none;
      }
      .flex-container {
        .title {
          flex: 1 1;
          text-align: left;
          padding-left: 10px;
          a.entry {
            color: #495060;
            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }
        .creator {
          flex: none;
          width: 200px;
          text-align: center;
        }
        .date {
          flex: none;
          width: 200px;
          text-align: center;
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-course {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .course-animate-enter-active {
    animation: fadeIn 1s;
  }
</style>
