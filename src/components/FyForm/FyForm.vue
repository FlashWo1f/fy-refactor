<template>
  <a-form
    :model="formValue"
    label-width="70px"
    :class="{ 'fy-form-inline': $attrs.layout === 'inline' }"
    v-bind="$attrs"
    :ref="formRef || ''"
  >
    <!-- {{ JSON.stringify(typeof form_items) }} -->
    <template v-for="(item, index) in form_items">
      <!-- 适用信息表单 -->
      <template v-if="Array.isArray(item)">
        <a-row :key='index'>
          <a-col :span="child.col || 12" v-for='(child, idx) in item' :key='idx + child.attrs.key'>
            <a-form-item
              :key="index + child.attrs.key"
              v-if="child._ifRender"
              :class="child.itemAttrs.className"
              v-bind="child.itemAttrs || {}"
              :name="child.attrs.key"
            >
              <slot v-if="child.slot" :name="child.slot" />
              
              <component 
                v-else
                :is="child.tag"
                :class="child.itemAttrs.className"
                v-model:value="formValue[child.attrs.key]"
                v-bind="child.attrs || {}"
                @keyup.enter="child.listeners && child.listeners.enterQuery && handleSubmit()"
                v-on="child.listeners || {}"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <!-- 适用表格搜索框 -->
      <template v-else>
        <a-form-item
          :key="index + item.attrs.key"
          v-if="item._ifRender"
          :class="item.itemAttrs.className"
          v-bind="item.itemAttrs || {}"
          :name="item.attrs.key"
        >
          <slot v-if="item.slot" :name="item.slot" />
          
          <component 
            v-else
            :is="item.tag"
            :class="item.itemAttrs.className"
            v-model:value="formValue[item.attrs.key]"
            v-bind="item.attrs || {}"
            @keyup.enter="item.listeners && item.listeners.enterQuery && handleSubmit()"
            v-on="item.listeners || {}"
          />
        </a-form-item>
      </template>
    </template>
    <div class="form-btn" v-if="submit || reset">
      <a-button :style="{ marginRight: '15px' }" type="primary" @click="handleSubmit" v-if="submit">{{
        $attrs.submitContext || "查询"
      }}</a-button>
      <a-button :style="{ marginLeft: '0' }" @click="myReset(formRef)" v-if="reset">{{
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
    const f_ref = ref(null)

    onMounted(() => {
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
      context.emit("query", props.formValue)
    }

    //根据formItem计算出实际需要让页面渲染的真正的_formItem数据
    const form_items = computed(() => {
      let items = []
      items = props.formItems.map((item) => 
        Array.isArray(item) ?
          item.map(v => computeFormItem(v, props.formValue))
          :
          computeFormItem(item, props.formValue)
      )
      return items
    })

    return {
      form_items,
      [props.formRef]: f_ref,
      myReset,
      handleSubmit,
    }
  },
}
</script>

<style lang="less">
.fy-form-inline {
  display: flex;
  flex-wrap: wrap;
  .form-btn {
    // align-self: center;
  }
}
</style>
