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
]

export const columns = [
  // { title: "序号", slots: { customRender: "no" } },
  { title: "姓名", dataIndex: "name", key: "name", fixed: "left", width: "140px" },
  { title: "身份证/护照", dataIndex: "idNumber", key: "idNumber" },
  { title: "工号", dataIndex: "jobNumber", key: "jobNumber" },
  { title: "手机号", dataIndex: "phone", key: "phone" },
  { title: "参与活动", dataIndex: "activityName", key: "activityName"  },
  { title: "测评产品", dataIndex: "modeName", key: "modeName" },
  { title: "所属公司", dataIndex: "companyName", key: "company" },
  { title: "报告总数", dataIndex: "reportNum", key: "reportNum" },
  { title: "下载报告", slots: { customRender: "download" } },
  { title: "测评状态", slots: { customRender: "status" } },
  { title: "完成时间", dataIndex: "endAt", key: "endAt" },
  { title: "操作", slots: { customRender: "operate" }, fixed: "right" },
];

