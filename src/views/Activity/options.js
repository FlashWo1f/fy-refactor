import { activityStatus } from "@/utils/const";
const curStatus = activityStatus.map(v => [-1, 3].includes(v.value) ? { ...v, disabled: true } : { ...v, disabled: false })
const overdueStatus = activityStatus.map(v => ![-1, 3].includes(v.value) ? { ...v, disabled: true } : { ...v, disabled: false })

export const tableColumns = [
  { title: "序号", slots: { customRender: "no" }, fixed: 'left', width: 60 },
  { title: '活动名称', slots: { customRender: "name" } },
  { title: '开始  /  结束时间', slots: { customRender: "time" } },
  { title: '活动状态', slots: { customRender: "actStatus" } },
  { title: '是否开启', slots: { customRender: "status" } },
  { title: '是否公开', slots: { customRender: "publicFlag" } },
  { title: '完成 / 总人数', slots: { customRender: "finished" } },
  { title: '创建人', dataIndex: "createdByName" },
  { title: '参与活动用户', slots: { customRender: "userPage", fixed: 'right' } },
  { title: '操作', slots: { customRender: "operate" }, fixed: 'right' },
]

export const curForm = [
  {
    tag: 'input',
    itemAttrs: {
      label: "活动名称",
    },
    attrs: {
      key: 'name',
      placeholder: "请输入活动名称"
    },
  },
  {
    tag: 'select',
    itemAttrs: {
      label: '活动状态',
    },
    attrs: {
      key: 'status',
      style: { width: '100px' },
      options: curStatus
    }
  },
  {
    tag: 'select',
    itemAttrs: {
      label: '是否公开',
    },
    attrs: {
      key: 'publicFlag',
      style: { width: '100px' },
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '2' },
      ]
    }
  },
  {
    tag: 'rangePicker',
    itemAttrs: {
      label: '活动时间',
    },
    attrs: {
      key: 'activityTime',
      showTime: {
        format: 'HH:mm:ss'
      },
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      format: "YYYY-MM-DD HH:mm:ss",
      getCalendarContainer: function(e) {
        return e.parentNode
      }
    }
  },
]

export const historyForm = [
  {
    tag: 'input',
    itemAttrs: {
      label: "活动名称",
    },
    attrs: {
      key: 'name',
      placeholder: "请输入活动名称"
    },
  },
  {
    tag: 'select',
    itemAttrs: {
      label: '活动状态',
    },
    attrs: {
      key: 'status',
      style: { width: '100px' },
      options: overdueStatus
    }
  },
  {
    tag: 'select',
    itemAttrs: {
      label: '是否公开',
    },
    attrs: {
      key: 'publicFlag',
      style: { width: '100px' },
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '2' },
      ]
    }
  },
  {
    tag: 'rangePicker',
    itemAttrs: {
      label: '活动时间',
    },
    attrs: {
      key: 'activityTime',
      showTime: {
        format: 'HH:mm:ss'
      },
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      format: "YYYY-MM-DD HH:mm:ss",
      getCalendarContainer: function(e) {
        console.log('iiiii', e)
        return e.parentNode
      }
    }
  },
]