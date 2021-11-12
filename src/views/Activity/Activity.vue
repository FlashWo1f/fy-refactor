<template>
  <div class="activity-page">
    <a-card>
      <a-tabs v-model:activeKey="curTab" @change="handleTabsChange">
        <a-tab-pane key="1" tab="正在进行">
          <FyForm
            formRef="currentAct"
            :formItems="curForm"
            :formValue="formValue"
            layout="inline"
            @query="onSubmit"
          />
          <div class="operate-line">
            <a-button type='primary'>新建活动</a-button>
          </div>
          <a-table bordered :columns="tableColumns" :data-source="tableData.list" rowKey="id" :pagination="false">
            <template #no="{ index }">
              {{ (tableData.pageNo - 1) * tableData.pageSize + index + 1 }}
            </template>
            <template #name="{ record }">
              <a-button type="link" @click.stop="handleClickCheck(true, record)">{{ record.name }}</a-button>
            </template>
            <template #time="{ record }">
              {{ `${record.startTime} / ${record.endTime}` }}
            </template>
            <template #actStatus="{ record }">
              <a-badge :status="statusColorMapAntd[record.activityStatusName]" :text="record.activityStatusName" />
            </template>
            <template #status="{ record }">
              <a-popconfirm 
                :title="`确定要改变此活动的有效性吗？\n${record.status === 1 ? '(此活动关闭后将收录到历史活动tab页下)' : '(此活动开启后若未过期将收录到正在进行tab页下)'}`"
                ok-text="确认"
                cancel-text="取消"
                @confirm="() => triggerActivitySwitch(record)"
              >
                <a-switch :checked="record.status === 1" />
              </a-popconfirm>
            </template>
            <template #publicFlag="{ record }">
              <a-popconfirm 
                title="确定要改变此活动的公开状态吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="() => triggerSwitch(record)"
              >
                <a-switch :checked="record.publicFlag === 1" />
              </a-popconfirm>
            </template>
            <template #finished="{ record }">
              {{ finishAndAllJoined(record) }}
            </template>
            <template #userPage="{ record }">
              <a-button type="link" @click.stop="handleGoUserPage(record.id)">查看</a-button>
            </template>
            <template #operate="{ record }">
              <a-button type="link" @click.stop="handleClickLink(true, record)">生成链接</a-button>
              <a-button @click.stop="handleClickCheck(true, record)" type="link">查看</a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="历史活动">
          <FyForm
            formRef="historyAct"
            :formItems="historyForm"
            v-model:formValue="formValue"
            layout="inline"
            @query="onSubmit"
          />
          <a-table
            bordered
            :data-source='tableData.list'
            :loading='tableLoading'
            :columns="tableColumns"
            :style="{ marginTop: '20px' }"
            rowKey='id'
          >
            <template #no="{ index }">
              {{ (tableData.pageNo - 1) * tableData.pageSize + index + 1 }}
            </template>
            <template #name="{ record }">
              <a-button type="link" @click.stop="handleClickCheck(true, record)">{{ record.name }}</a-button>
            </template>
             <template #time="{ record }">
              {{ `${record.startTime} / ${record.endTime}` }}
            </template>
            <template #actStatus="{ record }">
              <a-badge :status="statusColorMapAntd[record.activityStatusName]" :text="record.activityStatusName" />
            </template>
            <template #status="{ record }">
              <a-popconfirm 
                :title="`确定要改变此活动的有效性吗？\n${record.status === 1 ? '(此活动关闭后将收录到历史活动tab页下)' : '(此活动开启后若未过期将收录到正在进行tab页下)'}`"
                ok-text="确认"
                cancel-text="取消"
                @confirm="() => triggerActivitySwitch(record)"
              >
                <a-switch :checked="record.status === 1" />
              </a-popconfirm>
            </template>
            <template #publicFlag="{ record }">
              <a-popconfirm 
                title="确定要改变此活动的公开状态吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="() => triggerSwitch(record)"
              >
                <a-switch :checked="record.publicFlag === 1" />
              </a-popconfirm>
            </template>
            <template #finished="{ record }">
              {{ finishAndAllJoined(record) }}
            </template>
            <template #userPage="{ record }">
              <a-button type="link" @click.stop="handleGoUserPage(record.id)">查看</a-button>
            </template>
            <template #operate="{ record }">
              <a-button type="link" @click.stop="handleClickLink(true, record)">生成链接</a-button>
              <a-button @click.stop="handleClickCheck(true, record)" type="link">查看</a-button>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <FyPagination :tableData="tableData" @query="query" />
      <NewOrEditModal v-model:visible="dialogFormVisible" @query="query" :operate="operate" :detail="detail" />
      <LinkModal v-model:visible="linkVisible" :actLink="actLink" v-model:qrCodeLink="qrCodeLink" :actName="actName" />
    </a-card>
  </div>
</template>

<script>
import { getActivityTable, triggerSwitchById, fetchDetailById, activitySwitch, getOverdueActivity, getCurrentActivity } from "@/api/activity";
import { onMounted, reactive } from "vue"
import { tableColumns, curForm, historyForm } from "./options";
import FyForm from "@/components/FyForm/FyForm.vue"
import FyPagination from "@/components/FyPagination/pagination.vue"
import { statusColorMapAntd } from "@/utils/const";
import { showMessage, trimFormValue } from '@/utils/utils'
import LinkModal from "./LinkModal.vue";
import NewOrEditModal from "./NewOrEditModal.vue";
export default {
  data() {
    this.tableColumns = tableColumns
    this.curForm = curForm
    this.historyForm = historyForm
    this.statusColorMapAntd = statusColorMapAntd
    return {
      formValue: {
        name: undefined,
        activityTime: [],
        status: undefined,
        publicFlag: undefined,
        createdByName: undefined,
      },
      curTab: '1',
      tableLoading: false,
      linkVisible: false,
      dialogFormVisible: false,
      actLink: "",
      actName: "",
      operate: "",
      qrCodeLink: "",
      detail: {},
      tableData: {
        list: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
    }
  },
  mounted() {
    this.query()
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {

      } else {
        this.detail = {}
      }
    },
    $route: {
      handler(to) {
        if (to.query.tab === "2") {
          this.curTab = "2";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    query(formValue = {}) {
      if (formValue.activityTime && Array.isArray(formValue.activityTime)) {
        formValue.startTime = formValue.activityTime[0];
        formValue.endTime = formValue.activityTime[1];
        this.formValue.startTime = formValue.activityTime[0];
        this.formValue.endTime = formValue.activityTime[1];
        delete formValue.activityTime;
      }
      const myQuery = this.curTab === "1" ? getCurrentActivity : getOverdueActivity;
      this.tableLoading = true;
      myQuery({ ...this.formValue, ...formValue, companyId: this.$route.params.id })
        .then((res) => {
          this.tableData = { ...res.result };
        })
        .finally(() => (this.tableLoading = false));
    },
    finishAndAllJoined({ finishNum, totalTesterNum }) {
      return (finishNum || finishNum === 0) && (totalTesterNum || totalTesterNum === 0) ? finishNum + " / " + totalTesterNum : "0 / 0";
    },
    // 是否开启
    triggerActivitySwitch({ id, status }) {
      activitySwitch({
        ids: Array.isArray(id) ? id : [id],
        status: status === 1 ? 2 : 1,
      }).then((res) => {
        if (res.success) {
          const { pageNo } = this.tableData;
          this.query({ pageNo });
          showMessage("success", "修改成功!");
        }
      });
    },
    // 是否公开
    triggerSwitch({ id, publicFlag }) {
      triggerSwitchById({ id, publicFlag: publicFlag === 1 ? 2 : 1 }).then((res) => {
        if (res.success) {
          const { pageNo } = this.tableData;
          this.query({ pageNo });
          showMessage("success", "修改成功!");
        }
      })
    },
    handleClickLink(flag, { url = "", qrCode = "", name = "" }) {
      this.actLink = url;
      this.actName = name;
      this.qrCodeLink = qrCode;
      this.linkVisible = flag;
    },
    handleClickCheck(flag, row) {
      this.operate = "check";
      if (row) {
        fetchDetailById(row.id).then((res) => {
          if (res.success) {
            const industryModelId = res.result.industryModelId ? {} : { industryModelId: -1 };
            this.detail = { ...res.result, ...industryModelId };
            this.dialogFormVisible = true;
          }
        });
      }
    },
    handleGoUserPage(id) {
      this.$router.push({
        name: 'activity-user',
        params: {
          id
        }
      });
    },
    handleTabsChange(e) {
      this.curTab = e;
      e === "2" ? this.$router.replace("/activity?tab=2") : this.$router.replace("/activity");
      this.clearFields();
      this.query();
    },
    clearFields() {
      Object.keys(this.formValue).forEach((item) => {
        if (Array.isArray(this.formValue[item])) {
          this.formValue[item] = [];
        } else {
          this.formValue[item] = undefined;
        }
      });
    },
    onSubmit(params) {
      const formValue = trimFormValue({
        ...params,
      });
      this.query(formValue)
    },
  },
  setup() {
    onMounted(() => {
    })
    return {
    }
  },
  components: {
    FyForm,
    LinkModal,
    NewOrEditModal,
    FyPagination,
  },
}
</script>

<style></style>
