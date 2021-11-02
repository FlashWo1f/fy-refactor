<template>
  <div class="activity-page">
    <a-card>
      <a-tabs :active-key="curTab" @change="handleTabsChange">
        <a-tab-pane key="1" tab="正在进行">
          <FyForm
            formRef="currentAct"
            :formItems="curForm"
            :formValue="formValue"
            layout="inline"
            @query="onSubmit"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="历史活动"></a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue"
import { tableColumns, curForm, historyForm } from "./options";
import FyForm from "@/components/FyForm/FyForm.vue"
export default {
  data() {
    this.tableColumns = tableColumns
    this.curForm = curForm
    this.historyForm = historyForm
    return {
      formValue: {
        name: undefined,
        activityTime: [],
        status: undefined,
        publicFlag: undefined,
        createdByName: undefined,
      },
    }
  },
  setup() {
    onMounted(() => {
      log("*****")
    })
    function handleTabsChange() {}
    function onSubmit(params) {
      log('onSubmit::', params)
    }
    return {
      handleTabsChange,
      onSubmit,
    }
  },
  components: {
    FyForm,
  },
}
</script>

<style></style>
