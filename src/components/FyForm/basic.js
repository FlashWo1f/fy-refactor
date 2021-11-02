//所以组件继承自BASIC，建立映射关系
export const basic = {
  input: {
    component: "a-input",
    attrs: {
      placeholder: "请输入",
      allowClear: true
    },
    listeners: {
      'enterQuery': true
    }
  },
  select: {
    component: "a-select",
    attrs: {
      placeholder: "请选择",
      options: [],
      allowClear: true
    }
  },
  rangePicker: {
    component: "a-range-picker",
    attrs: {
      placeholder: ['开始时间', '结束时间'],
      allowClear: true,
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    }
  },
  monthPicker: {
    component: "a-month-picker",
    attrs: {
      placeholder: '请选择',
      allowClear: true,
      format: "YYYY-MM",
      valueFormat: "YYYY-MM"
    }
  },
  radio: {
    component: "a-radio-group", //自定义组件,为了在el-radio-group添加options能够生成el-radio节点
    value: [],
    attrs: {
      placeholder: "请选择",
      options: [],
      allowClear: true
    }
  },
  checkbox: {
    component: "a-checkbox"
  },
  "checkbox-group": {
    component: "base-checkbox-group", //同上
    attrs: {
      options: []
    }
  },
  cascader: {
    component: "el-cascader",
    attrs: {
      placeholder: "请选择",
      allowClear: true
    }
  },
  textarea: {
    component: "a-textarea",
    attrs: {
      placeholder: "请输入",
      allowClear: true
    }
  }
};
