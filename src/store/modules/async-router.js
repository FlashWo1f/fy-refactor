import { asyncRoutes, constantRoutes } from "@/router"
import { generatorDynamicRouter } from '@/router/generate-router'
import router from "../../router"
const asyncRouter = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: [],
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
  },
  actions: {
    generateRoutes({ commit }, routes) {
      return new Promise((resolve) => {
        generatorDynamicRouter().then(res => {
          commit("SET_ROUTES", res)
        })
        let accessedRoutes = []
        accessedRoutes = routes

        resolve(accessedRoutes)
      })
    },
  },
}

export default asyncRouter
