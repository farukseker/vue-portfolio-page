import { createRouter, createWebHistory } from 'vue-router'
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: '/',
    name: 'admin',
    component: () => import(/* webpackChunkName: "md" */ '../views/admin/AdminView.vue'),
    children: [
      {
        path: '/auth',
        name: 'auth',
        component: () => import(/* webpackChunkName: "auth" */ '../views/login/AuthView.vue'),
        children: [
          {
            path: 'login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '../views/login/LoginView.vue')
          },      {
            path: 'register',
            name: 'register',
            component: () => import(/* webpackChunkName: "register" */ '../views/login/RegisterView.vue')
          }
        ]
      },
      {
        path: 'home',
        name: 'admin-home',
        component: () => import(/* webpackChunkName: "md" */ '../views/admin/AdminMain.vue')
      },
      {
        path: 'page',
        name: 'admin-page',
        component: () => import(/* webpackChunkName: "admin-page" */ '../views/admin/PageList.vue')
      },
      {
        path: 'page/:page_name/edit',
        name: 'admin-page-edit',
        component: () => import(/* webpackChunkName: "admin-page" */ '../views/admin/PageEdit.vue'),
        props: true
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import(/* webpackChunkName: "admin-page" */ '../views/admin/dashboard/DashBoardView.vue')
      },
      {
        path: 'dashboard/:page_name/',
        name: 'admin-dashboard-page',
        component: () => import(/* webpackChunkName: "admin-dashboard-page" */ '../views/admin/dashboard/PageAnalyticsView.vue'),
        props: true
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import(/* webpackChunkName: "admin-projects" */ '../views/admin/project/ProjectListView.vue')
      },
      {
        path: 'project/:slug',
        name: 'admin-project',
        component: () => import(/* webpackChunkName: "project-edit" */ '../views/admin/project/ProjectEditView.vue'),
        props: true
      },
      {
        path: 'tags',
        name: 'admin-tag-manage',
        component: () => import(/* webpackChunkName: "project-edit" */ '../views/admin/tag/TagEditView.vue'),
      },
      {
        path: 'resume-edit',
        name: 'resume-edit',
        component: () => import(/* webpackChunkName: "project-edit" */ '../views/admin/resume/ResumeEdit.vue'),
      },
      {
        path: 'todos',
        name: 'todos',
        component: () => import(/* webpackChunkName: "project-edit" */ '../views/admin/todo/AdvanceTodoView.vue'),
      },
      {
        path: 'otp',
        name: 'otp',
        component: () => import(/* webpackChunkName: "project-edit" */ '../views/admin/otp/OtpManager.vue'),
      },{
        path: 'userflow',
        name: 'user-flow',
        component: () => import(/* webpackChunkName: "userflow" */ '../views/admin/userflow/UserFlowView.vue'),
      },{
        path: 'analytic-media',
        name: 'analytic-media',
        component: () => import(/* webpackChunkName: "analytic-media" */ '../views/admin/analytic_media/analytic_media_manager_view.vue'),
      
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active", // active class for non-exact links.
  linkExactActiveClass: "active" // active class for *exact* links.
})

export default router
