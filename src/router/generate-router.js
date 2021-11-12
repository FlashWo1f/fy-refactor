import userManage from "@/api/userManage"
import Layout from "@/layout/index.vue"
import { message } from "ant-design-vue"
import router from './index'

const constantRouterMap = [
  {
    path: "/",
    name: "dashboard",
    component: Layout,
    redirect: "/tester",
    children: [
      {
        path: "tester",
        name: "tester",
        component: () => import("@/views/Tester/Tester"),
        meta: { title: "测试", icon: "el-icon-notebook-2" },
      },
    ],
  },
]

const datas = [
  // {
  //   path: "/",
  //   name: "companyinfo",
  //   component: Layout,
  //   redirect: "/index",
  //   children: [
  //     {
  //       path: "index",
  //       name: "companyinfo-index",
  //       component: () => import("@/views/CompanyInfo/newHome"),
  //       meta: { title: "首页", icon: "el-icon-notebook-2" },
  //     },
  //   ],
  // },
  {
    path: "/activity",
    name: "activity",
    component: Layout,
    // code 错了
    code: "120001",
    meta: { title: "活动管理", icon: "el-icon-share" },
    redirect: '/activity/index',
    children: [
      {
        path: 'index',
        name: 'activity-id',
        component: () => import("@/views/Activity/Activity.vue"),
        meta: { title: "活动管理", icon: "el-icon-share" },
      },
      {
        path: "tester/:id",
        name: "activity-tester",
        component: () => import("@/views/Activity/UserInActivity/index.vue"),
        meta: {
          title: "活动用户",
          completePath: "/activity/tester/:id",
        },
        hidden: true,
      },
      // {
      //   path: "contrast",
      //   name: "user-contrast",
      //   component: () => import("@/views/Activity/UserInActivity/Contrast"),
      //   meta: {
      //     title: "交叉对比",
      //     activeMenu: "/activity/index",
      //     parent: ["activity-index", "activity-tester"],
      //     parentPath: ["/activity/index", "/activity/tester/:id"],
      //     completePath: "/activity/contrast",
      //   },
      //   hidden: true,
      // },
    ],
  },
  // {
  //   path: "/tester",
  //   name: "tester",
  //   component: Layout,
  //   code: "111100",
  //   redirect: "/tester/index",
  //   children: [
  //     {
  //       path: "index",
  //       name: "tester-index",
  //       component: () => import("@/views/Tester/testManage"),
  //       meta: { title: "受测者管理", icon: "el-icon-user" },
  //     },
  //   ],
  // },
  // {
  //   path: "/user",
  //   name: "user",
  //   component: Layout,
  //   redirect: "/user/index",
  //   code: "112100",
  //   children: [
  //     {
  //       path: "index",
  //       name: "user-index",
  //       component: () => import("@/views/User/tab"),
  //       meta: { title: "系统管理员", icon: "el-icon-lock" },
  //     },
  //   ],
  // },
  // {
  //   path: "/feedback",
  //   name: "feedback",
  //   component: Layout,
  //   redirect: "/feedback/list",
  //   code: "113200",
  //   children: [
  //     {
  //       path: "list",
  //       name: "feedback-list",
  //       component: () => import("@/views/feedback/feedback"),
  //       meta: { title: "意见反馈", icon: "el-icon-edit-outline" },
  //     },
  //     {
  //       path: "add",
  //       name: "feedback-add",
  //       component: () => import("@/views/feedback/feedbackAdd"),
  //       meta: {
  //         title: "新增",
  //         activeMenu: "/feedback/list",
  //         parent: ["feedback-list"],
  //         parentPath: ["/feedback/list"],
  //         completePath: "/feedback/add",
  //       },
  //       hidden: true,
  //     },
  //   ],
  // },
  // {
  //   path: "/threeparty",
  //   name: "threeparty",
  //   component: Layout,
  //   code: "113100",
  //   redirect: "/threeparty/index",
  //   children: [
  //     {
  //       path: "index",
  //       name: "threeparty-index",
  //       component: () => import("@/views/ThreeParty/ThreeParty.vue"),
  //       meta: { title: "第三方对接", icon: "el-icon-connection" },
  //     },
  //   ],
  // },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: () => import("@/views/Login"),
  // },
]

export const generatorDynamicRouter = () => {
  const arr = []
  return new Promise((resolve, reject) => {
    userManage.getTreeRole().then((res) => {
      const { result } = res
      if (result.length === 0) {
        message.warning("当前用户无菜单权限，请联系管理员添加")
        reject("无菜单权限")
      }
      if (result && result.length > 0) {
        const codeList = result.map((v) => v.code)
        datas.forEach((t) => {
          codeList.includes(t.code) && arr.push(t)
        })
        arr.forEach(v => {
          // router.addRoute('dashboard', v)
        })
        // log("t.code", arr)
        resolve(arr)
      }
    })
  })
}

export { constantRouterMap, datas }
