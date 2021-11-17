export const formItems = [
  {
    tag: "input",
    itemAttrs: {
      label: "账号",
    },
    attrs: {
      key: "account",
      placeholder: "请输入账号",
    },
  },
  {
    tag: "input",
    itemAttrs: {
      label: "姓名",
    },
    attrs: {
      key: "name",
      placeholder: "请输入姓名",
    },
  },
  {
    tag: "input",
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
      label: "状态",
    },
    attrs: {
      key: "enable",
      options: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 2 },
      ],
    },
  },
]

export const columns = [
  { dataIndex: 'account', title: '账号' },
  { dataIndex: 'name', title: '姓名' },
  { dataIndex: 'phone', title: '手机' },
  { dataIndex: 'email', title: '邮箱' },
  { dataIndex: 'roleName', title: '角色' },
  { title: '状态', slots: { customRender: 'enable' } },
  { dataIndex: 'createdAt', title: '创建时间' },
  { title: '操作', slots: { customRender: 'operate' } },
]

export function getFormItemByOperate() {
  return [
    [
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "账号",
        },
        attrs: {
          key: "account",
          placeholder: "请输入账号",
        },
      },
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "姓名",
        },
        attrs: {
          key: "name",
          placeholder: "请输入姓名",
        },
      },
    ],
    [
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "手机号",
        },
        attrs: {
          key: "phone",
          placeholder: "请输入手机号",
        },
      },
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "邮箱",
        },
        attrs: {
          key: "email",
          placeholder: "请输入邮箱",
        },
      },
    ],
    [
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "工号",
        },
        attrs: {
          key: "jobNumber",
          placeholder: "请输入工号",
        },
      },
      {
        tag: "input",
        col: 12,
        itemAttrs: {
          label: "权限角色",
        },
        attrs: {
          key: "roleIds",
          placeholder: "请选择权限角色",
        },
      },
    ],
  ]
} 
