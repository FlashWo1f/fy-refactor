import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import { setupAntd } from "./ant-design-vue"
import store from "./store"
import "./permission"
import './style/global.less'
import FyForm from "@/components/FyForm/FyForm.vue"
import FyTableWrap from "@/components/FyTableWrap/table.vue";
import FyPagination from "@/components/FyPagination/pagination.vue"

window.log = console.log
// todo delete
console.warn = () => {}

const app = createApp(App)

setupAntd(app)
app.use(store)
app.use(router)
app.component('FyForm', FyForm)
app.component('FyTableWrap', FyTableWrap)
app.component('FyPagination', FyPagination)
app.mount("#app")
