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
  DatePicker,
  Badge,
  Switch,
  Radio,
  Tooltip,
  InputNumber,
  Upload,
  Cascader,
  Checkbox,
  CheckboxGroup,
} from "ant-design-vue"
import "ant-design-vue/dist/antd.css"
import * as iconsVue from '@ant-design/icons-vue'
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
  DatePicker,
  Badge,
  Switch,
  Radio,
  Tooltip,
  InputNumber,
  Upload,
  Cascader,
  Checkbox,
  CheckboxGroup,
]

const icons = [
  'PlusOutlined',
  'LoadingOutlined',
]
export function setupAntd(app) {
  components.forEach((component) => {
    app.use(component)
  })
  icons.forEach(icon => {
    // 这里这么写的原因是 PlusOutlined 的 name 是 PlusOutlined3
    // 为保障 icon 组件 name 同 component
    app.component(icon, iconsVue[icon])
  })
}
