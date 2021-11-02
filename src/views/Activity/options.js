import { activityStatus } from "@/utils/const";
const curStatus = activityStatus.map(v => [-1, 3].includes(v.value) ? { ...v, disabled: true } : { ...v, disabled: false })
const overdueStatus = activityStatus.map(v => ![-1, 3].includes(v.value) ? { ...v, disabled: true } : { ...v, disabled: false })

export const tableColumns = [
  { attrs: { label: '序号', minWidth: '50'}, slot: 'order' },
  { attrs: { label: '活动名称', prop: 'name', minWidth: '180' }, slot: 'name' },
  { attrs: { label: '开始  /  结束时间', minWidth: '180' }, slot: 'time' },
  { attrs: { label: '活动状态', minWidth: '110' }, slot: 'actStatus' },
  { attrs: { label: '是否开启', minWidth: '90' }, slot: 'status' },
  { attrs: { label: '是否公开', minWidth: '90' }, slot: 'publicFlag' },
  { attrs: { label: '完成 / 总人数', minWidth: '120' }, slot: 'finished' },
  { attrs: { label: '创建人', prop: 'createdByName', minWidth: '160' } },
  { attrs: { label: '参与活动用户', minWidth: '110', fixed: 'right' }, slot: 'userPage' },
  { attrs: { label: '操作', minWidth: '140', fixed: 'right' }, slot: 'operate' },
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
        return e.parentNode
      }
    }
  },
]