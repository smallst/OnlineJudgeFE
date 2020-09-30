import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, Conf, Contest, ContestList, Collection, CollectionList, Home, JudgeServer, Login,
         ParticipantList,
  Problem, ProblemList, User, PruneTestCase, Dashboard, ProblemImportOrExport } from './views'
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/admin/',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: '/announcement',
          name: 'announcement',
          component: Announcement
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
        {
          path: '/conf',
          name: 'conf',
          component: Conf
        },
        {
          path: '/judge-server',
          name: 'judge-server',
          component: JudgeServer
        },
        {
          path: '/prune-test-case',
          name: 'prune-test-case',
          component: PruneTestCase
        },
        {
          path: '/problems',
          name: 'problem-list',
          component: ProblemList
        },
        {
          path: '/problem/create',
          name: 'create-problem',
          component: Problem
        },
        {
          path: '/problem/edit/:problemId',
          name: 'edit-problem',
          component: Problem
        },
        {
          path: '/problem/batch_ops',
          name: 'problem_batch_ops',
          component: ProblemImportOrExport
        },
        {
          path: '/practice/create',
          name: 'create-practice',
          component: Collection,
          props: {type: 'practice', method: 'create'}
        },
        {
          path: '/practice/edit',
          name: 'edit-practice',
          component: Collection,
          props: {type: 'practice', method: 'edit'}
        },
        {
          path: '/course/create',
          name: 'create-course',
          component: Collection,
          props: {type: 'course', method: 'create'}
        },
        {
          path: '/course/edit',
          name: 'edit-course',
          component: Collection,
          props: {type: 'course', method: 'edit'}
        },
        {
          path: '/practice',
          name: 'practice-list',
          component: CollectionList,
          props: {type: 'practice'}
        },
        {
          path: '/course',
          name: 'course-list',
          component: CollectionList,
          props: {type: 'course'}
        },
        {
          path: '/course/:id/problems',
          name: 'course-problem-list',
          component: ProblemList,
          props: {collectionType: 'course'}
        },
        {
          path: '/practice/:id/participants',
          name: 'practice-participants-list',
          component: ParticipantList,
          props: {collectionType: 'practice'}
        },
        {
          path: '/practice/:id/problems',
          name: 'practice-problem-list',
          component: ProblemList,
          props: {collectionType: 'practice'}
        },
        {
          path: '/course/:cid/problem/create',
          name: 'create-course-problem',
          component: Problem,
          props: {type: 'course'}
        },
        {
          path: '/practice/:cid/problem/create',
          name: 'create-practice-problem',
          component: Problem,
          props: {type: 'practice'}
        },
        {
          path: '/course/:courseId/problem/:problemId/edit',
          name: 'edit-course-problem',
          component: Problem
        },
        {
          path: '/contest/create',
          name: 'create-contest',
          component: Contest
        },
        {
          path: '/contest',
          name: 'contest-list',
          component: ContestList
        },
        {
          path: '/contest/:contestId/edit',
          name: 'edit-contest',
          component: Contest
        },
        {
          path: '/contest/:contestId/announcement',
          name: 'contest-announcement',
          component: Announcement
        },
        {
          path: '/contest/:contestId/problems',
          name: 'contest-problem-list',
          component: ProblemList
        },
        {
          path: '/contest/:contestId/problem/create',
          name: 'create-contest-problem',
          component: Problem
        },
        {
          path: '/contest/:contestId/problem/:problemId/edit',
          name: 'edit-contest-problem',
          component: Problem
        }
      ]
    },
    {
      path: '*', redirect: '/login'
    }
  ]
})
