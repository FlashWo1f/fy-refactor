<template>
  <a-modal
    :visible="visible"
    title="拍卖列表"
    width="1000px"
    @cancel="$emit('update:visible', false)"
    @ok='handleSubmit'
    okText='确认'
    cancelText='取消'
    :confirmLoading="submitLoading"
  >
    <div style="text-align: right; margin-bottom: 10px">
      <a-button @click='handleSwitchMode' type='link'>
        {{ operate === 'check' ? '编辑' : '取消编辑' }}
      </a-button>
    </div>
    <FyForm
      :formItems='formItems'
      v-model:formValue='formValue'
      @query="query"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 17 }"
      :submit='false'
      :reset='false'
    >

    </FyForm>
  </a-modal>
</template>

<script>
import { getFormItemByOperate } from './options'
export default {
  data() {
    return {
      formItems: getFormItemByOperate(),
      formValue: {

      },
      operate: 'check'
    }
  },
  methods: {
    handleSwitchMode() {
      const cur = this.operate
      this.operate = cur === 'check' ? 'edit' : 'check'
    }
  },
  props: {
    visible: {
      type: Boolean,
    }
  }
}
</script>

<style>

</style>