<template>
  <div class="user-container">
    <a-card>
      <FyForm
        :formItems="formItems"
        v-model:formValue="formValue"
        layout="inline"
        @query="query"
      />
      <div class="operate-line">
        <a-button type="primary" @click="handleAddAdmin(true)">
          <template #icon>
            <PlusOutlined />
          </template>
          添加管理员
        </a-button>
      </div>
      <FyTableWrap
        :tableData="tableData"
        @query="query"
        :selectedRowKeys="false"
      >
        <a-table
          rowKey="userId"
          bordered
          :columns="columns"
          :pagination="false"
          :dataSource="tableData.list"
          :loading="tableLoading"
        >
          <template #enable="{ record }">
            <a-popconfirm 
              title="确定要改变该管理员的有效性吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="() => handleTriggerSwitch(record)"
            >
              <a-switch :checked="record.enable === 1" />
            </a-popconfirm>
          </template>
          <template #operate='{ record }'>
            <a-button @click="handleCheck(record)" type="link">查看</a-button>
            <a-button @click="handleResetPwd(true, record)" type="link">重置密码</a-button>
          </template>
        </a-table>
      </FyTableWrap>
      <UserDetail v-model:visible='visible' />
    </a-card>
  </div>
</template>

<script>
import { formItems, columns } from "./options"
import { fetchAdmin, triggerSwitch } from "@/api/user"
import UserDetail from './UserDetail.vue'
export default {
  data() {
    this.formItems = formItems
    this.columns = columns
    return {
      formValue: {
        name: "",
        phone: "",
        enable: undefined,
        account: "",
      },
      tableLoading: false,
      visible: false,
      tableData: {
        list: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query(params) {
      this.tableLoading = true
      fetchAdmin({
        ...this.formValue,
        ...params,
      }).then(res => {
        const { result, success } = res
        if (success) {
          this.tableData = result
        }
      }).finally(() => this.tableLoading = false)
    },
    handleAddAdmin() {},
    handleCheck() {
      this.visible = true
    },
    handleTriggerSwitch() {
      triggerSwitch({ userId, enable: enable === 1 ? 2 : 1 }).then((res) => {
        if (res.success) {
          const { pageNo } = this.tableData
          this.query({ pageNo })
          showMessage("success", "成功修改状态")
        }
      })
    },
  },
  components: {
    UserDetail,
  },
}
</script>

<style></style>
