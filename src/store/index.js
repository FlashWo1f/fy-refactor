import { createStore } from "vuex"
import user from "./modules/user"
import asyncRouter from "./modules/async-router"
import common from './modules/common'
import getters from "./getters"

export default createStore({
  modules: {
    asyncRouter,
    user,
    common,
  },
  getters,
})
