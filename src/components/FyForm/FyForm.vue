<template>
  <a-form
    :model="formValue"
    label-width="70px"
    :class="{ 'fy-form-inline': $attrs.layout === 'inline' }"
    v-bind="$attrs"
    :ref="formRef || ''"
  >
    <!-- {{ JSON.stringify(typeof _formItems) }} -->
    <a-range-picker>33</a-range-picker>
    <template v-for="(item, index) in _formItems">
      
      <a-form-item
        :key="index + item.attrs.key"
        v-if="item._ifRender"
        :class="item.itemAttrs.className"
        v-bind="item.itemAttrs || {}"
        :name="item.attrs.key"
      >
      {{ item.tag }}
        <slot v-if="item.slot" :name="item.slot" />
        
        <component 
          v-else
          :is="item.tag"
          :class="item.itemAttrs.className"
          v-model="formValue[item.attrs.key]"
          v-bind="item.attrs || {}"
          @keyup.enter="item.listeners && item.listeners.enterQuery && handleSubmit()"
          v-on="item.listeners || {}"
        />
      </a-form-item>
    </template>
    <div class="form-btn" v-if="submit || reset">
      <a-button type="primary" @click="handleSubmit" v-if="submit">{{
        $attrs.submitContext || "查询"
      }}</a-button>
      <a-button @click="myReset(formRef)" v-if="reset">{{
        $attrs.resetContext || "重置"
      }}</a-button>
    </div>
  </a-form>
</template>

<script>
import { computed, ref } from "@vue/reactivity"
import { basic } from "./basic"
import { onMounted } from '@vue/runtime-core'
export default {
  props: {
    formItems: {
      type: Array,
      required: true,
    },
    formRef: {
      type: String,
      default: "myform",
    },
    formValue: {
      type: Object,
      required: true,
    },
    submit: {
      type: Boolean,
      default: true,
    },
    reset: {
      type: Boolean,
      default: true,
    },
    onReset: {
      type: Function,
    },
  },
  setup(props, context) {
    log(111, props, context)
    const f_ref = ref(null)

    onMounted(() => {
      // console.log('f_reff_reff_ref', f_ref.value)
    })

    function computeFormItem(formItem, Model) {
      const item = { ...formItem }
      // 表单控件的类型
      const tag = item.tag || "input"
      // 对应到组件映射表
      const basicItem = basic[tag]
      item.tag = basicItem.component
      //继承基类的属性
      item.attrs = Object.assign({}, basicItem.attrs, item.attrs)
      item.listeners = Object.assign({}, basicItem.listeners, item.listeners)
      // 获取动态 Attributes
      if (item.getAttrs)
        item.attrs = Object.assign(item.attrs, item.getAttrs(Model))
      // 条件渲染
      item._ifRender = item.ifRender ? item.ifRender(Model) : true
      // 防止表单提交时存在多余 key
      if (!item._ifRender) {
        delete Model[item.attrs.key]
      }
      // form-item 配置
      return item
    }

    function handleSubmit() {
      context.emit("query", props.formValue)
    }

    function myReset(formRef) {
      f_ref.value.resetFields()
      props.onReset && props.onReset(formRef)
      context.emit("query")
    }

    //根据formItem计算出实际需要让页面渲染的真正的_formItem数据
    const _formItems = computed(() => {
      let items = []
      items = props.formItems.map((item) =>
        computeFormItem(item, props.formValue)
      )
      return items
    })

    return {
      _formItems,
      [props.formRef]: f_ref,
      myReset,
      handleSubmit,
    }
  },
  methods: {
    

  },
}
</script>

<style lang="less">
.fy-form-inline {
  display: flex;
  flex-wrap: wrap;
  .form-btn {
    align-self: center;
  }
}
</style>
