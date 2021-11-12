export const tableColumns = [
  { attrs: { type: "selection", width: "50", fixed: "left", reserveSelection: true } },
  { attrs: { label: "序号", minWidth: "50", fixed: "left" }, slot: "order" },
  { attrs: { label: "姓名", prop: "name", minWidth: "120", fixed: "left" } },
  { attrs: { label: "身份证 / 护照", prop: "idNumber", minWidth: "200" } },
  { attrs: { label: "工号", prop: "jobNumber", minWidth: "120" } },
  { attrs: { label: "手机号", prop: "phone", minWidth: "150" } },
  { attrs: { label: "邮箱", prop: "email", minWidth: "160" } },
  { attrs: { label: "测评状态", prop: "gameStatus", minWidth: "150" } },
  { attrs: { label: "完成时间", prop: "endAt", minWidth: "180" } },
  { attrs: { label: "操作", minWidth: 120, fixed: "right" }, slot: "operate" },
]

export const tableColumnsOfScore = [
  { attrs: { type: "selection", width: "50", fixed: "left" } },
  { attrs: { label: "序号", minWidth: "50", fixed: "left" }, slot: "order" },
  { attrs: { label: "姓名", prop: "name", minWidth: "120", fixed: "left" } },
  { attrs: { label: "身份证/护照", prop: "idNumber", minWidth: "160" } },
  { attrs: { label: "完成状态", prop: "gameStatus", minWidth: "150" } },
]

export const columns = [
  {
    prop: "name",
    label: "姓名",
    visible: true,
    width: "120px",
    fixed: "left",
    sortable: "custom",
  },
  {
    prop: "endAt",
    label: "完成时间",
    visible: true,
    width: "150px",
    sortable: "custom",
  },
  {
    prop: "idNumber",
    label: "身份证/护照",
    visible: true,
    width: "160px",
    fixed: "left",
  },
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