import {
  Form,
  Input,
  Button,
  Layout,
  Menu,
  Row,
  Col,
  Dropdown,
  Avatar,
  Tabs,
  Table,
  Alert,
  Card,
  List,
  Pagination,
  Divider,
  Popconfirm,
  Modal,
  Select,
  RangePicker,
} from "ant-design-vue"
import "ant-design-vue/dist/antd.css"

console.log("1@#!@#", RangePicker)
const components = [
  Form,
  Input,
  Button,
  Layout,
  Menu,
  Row,
  Col,
  Dropdown,
  Avatar,
  Tabs,
  Table,
  Alert,
  Card,
  List,
  Pagination,
  Divider,
  Popconfirm,
  Modal,
  Select,
  RangePicker,
]
export function setupAntd(app) {
  components.forEach((component) => {
    app.use(component)
  })
}
