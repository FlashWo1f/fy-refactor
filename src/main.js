import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import { setupAntd } from "./ant-design-vue"
import store from "./store"
import "./permission"
import './style/global.less'

window.log = console.log
// todo delete
console.warn = () => {}

const app = createApp(App)

setupAntd(app)
app.use(store)
app.use(router)
app.mount("#app")
