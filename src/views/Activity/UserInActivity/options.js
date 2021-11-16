export const tableColumns = [
  { title: '序号', width: 50, slots: { customRender: 'order' } },
  { title: '姓名', dataIndex: "name", width: 100 },
  { title: '身份证 / 护照', dataIndex: "idNumber", width: 140 },
  { title: '工号', dataIndex: "jobNumber", width: 70 },
  { title: '手机号', dataIndex: "phone", width: 120 },
  { title: '邮箱', dataIndex: "email", width: 120 },
  { title: '测评状态', dataIndex: "gameStatus", width: 80 },
  { title: '完成时间', dataIndex: "endAt", width: 150 },
  { title: '操作', width: 150, slots: { customRender: 'operate' } },
]

export const tableColumnsOfScore = [
  { attrs: { type: "selection", width: "50", fixed: "left" } },
  { attrs: { label: "序号", minWidth: "50", fixed: "left" }, slot: "order" },
  { attrs: { label: "姓名", prop: "name", minWidth: "120", fixed: "left" } },
  { attrs: { label: "身份证/护照", prop: "idNumber", minWidth: "160" } },
  { attrs: { label: "完成状态", prop: "gameStatus", minWidth: "150" } },
]

export const columns = [
  { title: '姓名', dataIndex: "name", visible: true, width: 120, fixed: 'left', sorter: true },
  { title: '身份证/护照', dataIndex: "idNumber", visible: true, width: 160, fixed: 'left' },
  { title: '完成时间', dataIndex: "endAt", visible: true, width: 150, sorter: true  },
  { title: '下载报告', visible: true, width: 70, slots: { customRender: 'report' }, fixed: 'right' },
  { title: '操作',  visible: true, width: 150, slots: { customRender: 'operate' }, fixed: 'right' },
]

export const formItems = [
  {
    itemAttrs: {
      label: "姓名",
    },
    attrs: {
      key: "name",
      placeholder: "请输入姓名",
    },
  },
  {
    itemAttrs: {
      label: "身份证/护照",
    },
    attrs: {
      key: "idNumber",
      placeholder: "请输入身份证/护照",
    },
  },
  {
    itemAttrs: {
      label: "工号",
    },
    attrs: {
      key: "jobNumber",
      placeholder: "请输入工号",
    },
  },
  {
    itemAttrs: {
      label: "手机号",
    },
    attrs: {
      key: "phone",
      placeholder: "请输入手机号",
    },
  },
  {
    tag: "select",
    itemAttrs: {
      label: "测评状态",
    },
    attrs: {
      key: "statusSet",
      mode: "multiple",
      style: {
        width: '200px'
      },
      options: [
        { label: "未开始", value: "1" },
        { label: "进行中", value: "2" },
        { label: "已完成", value: "3" },
      ],
    },
  },
  {
    tag: "select",
    itemAttrs: {
      label: "标星",
    },
    attrs: {
      style: {
        width: '100px'
      },
      key: "starFlag",
      options: [
        { label: "已标星", value: 1 },
        { label: "未标星", value: 2 },
      ],
    },
  },
]

export const formItemsOfScore = [
  {
    itemAttrs: {
      label: "姓名",
    },
    attrs: {
      key: "name",
      placeholder: "请输入姓名",
    },
  },
  {
    itemAttrs: {
      label: "身份证/护照",
    },
    attrs: {
      key: "idNumber",
      placeholder: "请输入身份证/护照",
    },
  },
  {
    tag: "select",
    itemAttrs: {
      label: "标星",
    },
    attrs: {
      key: "starFlag",
      options: [
        { label: "已标星", value: 1 },
        { label: "未标星", value: 2 },
      ],
    },
  },
  {
    slot: "scores",
    attrs: {
      key: "scores",
    },
    itemAttrs: {
      label: "分数区间",
    },
  },
  {
    slot: "matchValue",
    attrs: {
      key: "matchValue",
    },
    itemAttrs: {
      label: "匹配度",
    },
  },
]