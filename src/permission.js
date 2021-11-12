import router from "@/router"
import store from "./store"
import { constantRoutes, asyncRoutes } from '@/router'
import { generatorDynamicRouter } from '@/router/generate-router'

router.beforeEach(async (to, from, next) => {
  console.log("beforeEach ENTER", from.path, "=>", to.path)
  let token = localStorage.getItem("token")

  if (to.path === "/login") {
    next()
  } else if (!token) {
    next("/login")
  } else {
    // let { data } = await store.dispatch("user/GetInfo", token)
    // const accessedRoutes = await store.dispatch(
    //   "asyncRouter/generateRoutes",
    //   data.roles
    // )
    // accessedRoutes.forEach((item) => {
    //   log('??', item)
    //   router.addRoute(item)
    // })
    generatorDynamicRouter().then(res => {
      // store.commit("user/SET_MENUS", res)
      // log('!@#!@#', router)
    })
    next()
  }
})
