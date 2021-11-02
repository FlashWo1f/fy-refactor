import { createRouter, createWebHashHistory } from "vue-router"
import Layout from "@/layout/index.vue"
import BlankLayout from "@/layout/BlankLayout.vue"

export const constantRoutes = [
  {
    path: "/",
    name: "dashboard",
    component: Layout,
    redirect: "/tester",
    children: [
      {
        path: "tester",
        name: "tester",
        component: () => import("@/views/Tester/Tester.vue"),
        meta: { title: "测试", icon: "el-icon-notebook-2" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Login.vue"),
    hidden: true,
  },
  // {
  //   path: '/404',
  //   name: '404',
  //   component: () => import('@/views/error/404.vue'),
  //   hidden: true,
  // },
]

export const asyncRoutes = [
  {
    path: "/activity",
    component: () => import("@/views/Activity/Activity.vue"),
    name: "activity",
    meta: {
      title: "活动页",
      icon: "test-tube-line",
    },
  },
  {
    path: "/tester",
    component: () => import("@/views/Tester/Tester.vue"),
    name: "tester",
    meta: {
      title: "活动页",
      icon: "test-tube-line",
    },
  },
  {
    path: "/echart",
    component: BlankLayout,
    name: "echart",
    redirect: "/echart/bar",
    meta: {
      title: "动态路由测试",
      icon: "test-tube-line",
    },
    children: [
      {
        path: "bar",
        name: "Bar",
        component: () => import("@/views/echart/bar/index.vue"),
        meta: {
          title: "路由测试1",
          icon: "test-tube-line",
        },
      },
      {
        path: "line",
        name: "Line",
        component: () => import("@/views/echart/line/index.vue"),
        meta: {
          title: "路由测试2",
          icon: "test-tube-line",
        },
      },
      {
        path: "pie",
        name: "Pie",
        component: () => import("@/views/echart/pie/index.vue"),
        meta: {
          title: "路由测试3",
          icon: "test-tube-line",
        },
      },
    ],
  },
]

// {
//   path: "/error",
//   name: "Error",
//   component: Layout,
//   redirect: "/error/403",
//   meta: {
//     title: "错误页",
//     icon: "error-warning-line",
//   },
//   children: [
//     {
//       path: "403",
//       name: "Error403",
//       component: () => import("@/views/error/403.vue"),
//       meta: {
//         title: "403",
//         icon: "error-warning-line",
//       },
//     },
//     {
//       path: "404",
//       name: "Error404",
//       component: () => import("@/views/error/404.vue"),
//       meta: {
//         title: "404",
//         icon: "error-warning-line",
//       },
//     },
//   ],
// },
// {
//   path: "/echart",
//   component: Layout,
//   name: "echart",
//   redirect: "/echart/bar",
//   meta: {
//     title: "动态路由测试",
//     icon: "test-tube-line",
//     roles: ["admin", "editor"],
//   },
//   children: [
//     {
//       path: "bar",
//       name: "Bar",
//       component: () => import("@/views/echart/bar/index.vue"),
//       meta: {
//         title: "路由测试1",
//         icon: "test-tube-line",
//         roles: ["admin", "editor"],
//       },
//     },
//     {
//       path: "line",
//       name: "Line",
//       component: () => import("@/views/echart/line/index.vue"),
//       meta: {
//         title: "路由测试2",
//         icon: "test-tube-line",
//         roles: ["admin", "editor"],
//       },
//     },
//     {
//       path: "pie",
//       name: "Pie",
//       component: () => import("@/views/echart/pie/index.vue"),
//       meta: {
//         title: "路由测试3",
//         icon: "test-tube-line",
//       },
//     },
//   ],
// },
// {
//   path: "/system",
//   name: "system",
//   component: Layout,
//   redirect: "/system/account/index.vue",
//   meta: {
//     title: "system",
//     icon: "system",
//     roles: ["admin", "editor"],
//   },
//   children: [
//     {
//       path: "account",
//       name: "account",
//       component: () => import("@/views/system/account/index.vue"),
//       meta: {
//         title: "account",
//         icon: "account",
//         roles: ["editor"],
//       },
//     },
//     {
//       path: "group",
//       name: "group",
//       component: () => import("@/views/system/group/index.vue"),
//       meta: {
//         title: "group",
//         icon: "group",
//         roles: ["admin"],
//       },
//     },
//   ],
// },

constantRoutes[0].children = constantRoutes[0].children.concat(asyncRoutes)

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
