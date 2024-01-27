import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },{
    path: '/asset',
    name: "资产管理",
    component: Layout,
    meta: { title: '资产管理', icon: 'example', affix: false },
    redirect: '/asset',
    children: [
      {
        path: 'index',
        component: () => import('@/views/asset/index'),
        name: '资产列表',
        meta: { title: '资产列表', affix: false }
      },{
        path: 'detail',
        component: () => import('@/views/asset/detail'),
        name: '实例详情',
        meta: { title: '实例详情', affix: false },
        hidden: true
      },{
        path: 'task',
        component: () => import('@/views/asset/task_list'),
        name: '资产任务',
        meta: { title: '资产任务', affix: false }
      },{
        path: 'view',
        component: () => import('@/views/asset/view'),
        name: '任务视图',
        meta: { title: '任务视图', affix: false },
        hidden: true
      },{
        path: 'task_add',
        component: () => import('@/views/asset/task'),
        name: '新建任务',
        meta: { title: '新建任务', affix: false },
        hidden: true
      },{
        path: 'task_put',
        component: () => import('@/views/asset/task'),
        name: '修改任务',
        meta: { title: '修改任务', affix: false },
        hidden: true
      },{
        path: 'rule',
        component: () => import('@/views/asset/rule'),
        name: '任务配置',
        meta: { title: '任务配置', affix: false }
      },
    ]
  },{
    path: '/vul',
    name: "漏洞管理",
    component: Layout,
    meta: { title: '漏洞管理', icon: 'bug', affix: false },
    redirect: '/vul',
    children: [
      {
        path: 'index',
        component: () => import('@/views/poc-vul/index'),
        name: '漏洞列表',
        meta: { title: '漏洞列表', affix: false }
      },
      {
        path: 'trojan',
        component: () => import('@/views/poc-vul/trojan'),
        name: '在线肉鸡',
        meta: { title: '在线肉鸡', affix: false }
      },
      {
        path: 'proxy',
        component: () => import('@/views/service/list'),
        name: '服务代理',
        meta: { title: '服务代理', affix: false }
      },
      {
        path: 'poc/plugin',
        component: () => import('@/views/poc-vul/plugin'),
        name: 'Poc插件',
        meta: { title: 'Poc插件', affix: false }
      },
      {
        path: 'trap/plugin',
        component: () => import('@/views/trap/plugin'),
        name: '蜜罐识别插件',
        meta: { title: '蜜罐识别插件', affix: false }
      },
      {
        path: 'task_create',
        // component: () => import('@/views/poc-vul/task'),
        name: '新建代理',
        meta: { title: '新建代理', affix: false },
        hidden: true
      },
    ]
  },
  // {
  //   path: '/setting',
  //   component: Layout,
  //   redirect: '/setting',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/sys_config/index'),
  //       // component: () => import('@/views/error-page/401'),
  //       name: '系统设置',
  //       meta: { title: '系统设置', icon: 'el-icon-setting', affix: false },
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // componentsRouter
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
