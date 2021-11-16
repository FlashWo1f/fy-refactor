<template>
  <a-card>
    <a-tabs :default-active-key="curTab" @change="handleTabsChange">
      <a-tab-pane key="1" tab="活动用户管理">
        <Tab1 
          ref="tab1" 
          :curTab="curTab" 
          @query="query" 
          :tableLoading="tableLoading"
          v-model:tableData="tableData"
          v-model:sendTitle="sendTitle" 
          v-model:formValue="formValue"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="分数管理">
        <Tab2 
          ref="tab2" 
          :curTab="curTab"
          @query="query" 
          v-model:formValue="formValue1" 
          :tableLoading="tableLoading" 
          v-model:tableData="tableData" 
        />
      </a-tab-pane>
    </a-tabs>
    <Pagination :tableData="tableData" @query="query" />
    <sendMsg @clearSelected="clearSelected"></sendMsg>
    <!-- <UserDetail v-if="showDetail" :visible="showDetail" :handleSwitchModal="handleSwitchDetail" :id="curUserId" :operate="operate" @query="query" /> -->
  </a-card>
</template>

<script>
import Pagination from "@/components/FyPagination/pagination.vue";
// import UserDetail from "./UserDetail";
import { assignObj, trimFormValue, deleteEmptyField } from "@/utils/utils";
import { fetchActivityUser, EditStar, dimensionality, fetchScoreTable, getCompareByUserId, isBindingModal, sendSmsToTester } from "@/api/activity";
import sendMsg from "./sendMsg.vue"
import Tab1 from "./tab1.vue"
import Tab2 from "./tab2.vue"
import { tableColumns, columns, formItems, formItemsOfScore } from "./options";
export default {
  data() {
    this.tableColumns = tableColumns;
    this.formItems = formItems;
    this.formItemsOfScore = formItemsOfScore;
    return {
      sendTitle: "发送通知",
      allChecked: true,
      options: [],
      columns,
      tableLoading: false,
      operate: "",
      activityId: "",
      showDetail: false,
      formValue: {
        name: "",
        phone: "",
        jobNumber: "",
        starFlag: undefined,
        idNumber: "",
        statusSet: [],
      },
      formValue1: {
        name: "",
        starFlag: undefined,
        nameOrderType: null,
        endAtOrder: null,
        scores: [
          {
            scoreBegin: "",
            scoreEnd: "",
            dimensionalityCode: undefined,
            key: 0,
          },
        ],
        matchValueBegin: "",
        matchValueEnd: "",
        idNumber: "",
      },
      selectedId: [],
      selected: [],
      curUserId: "",
      tableData: {
        list: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      curTab: "1",
    };
  },
  created() {
    // log(';', this.$router.currentRoute.value)
    const {
      params: { id },
    } = this.$router.currentRoute.value;
    this.activityId = id;
    // this.$store.state.activity.curActId = id;
    localStorage.setItem("curActId", id);
  },
  mounted() {
    this.query();
    this.options = [];
  },
  watch: {
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
    query(params = {}, doNotClearSelected = false) {
      // 在视觉上 Antdv 只支持同时单列排序
      if(params.hasOwnProperty("completeTimeOrderType")){
        this.formValue1.completeTimeOrderType = params.completeTimeOrderType;
        this.formValue1.nameOrderType = null
      }
      if(params.hasOwnProperty("nameOrderType")){
        this.formValue1.nameOrderType = params.nameOrderType;
        this.formValue1.completeTimeOrderType = null
      }
      const formValue = this.curTab === "1" ? this.formValue : this.formValue1;
      console.log(JSON.stringify(this.formValue1));
      const value = deleteEmptyField(trimFormValue(assignObj(formValue)));
      if (value.activityTime) {
        value.startTime = value.activityTime[0];
        value.endTime = value.activityTime[1];
        delete value.activityTime;
      }
      const myQuery = this.curTab === "1" ? fetchActivityUser : fetchScoreTable;
      this.tableLoading = true;
      myQuery({
        ...value,
        activityId: this.activityId,
        ...params,
      }).then(
        (res) => {
          this.tableData = res.result;
          this.tableLoading = false;
          if (this.curTab === "2") {
            // 判断活动是否有详报
            this.$nextTick(() => {
              this.$refs.tab2.isExistReportInThisActivity();
            });
          }
          !doNotClearSelected && this.clearSelected();
          this.tableData.list?.forEach((item) => {
            Array.isArray(item.scores) &&
              item.scores.map((temp) => {
                item[temp.code] = temp;
              });
          });
        },
        (err) => (this.tableLoading = false)
      );
    },
    handleTabsChange(e) {
      this.curTab = e;
      this.tableData = {
        list: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      };
      if (e === "1") {
        this.$router.replace(`/act-user/${this.activityId}`);
      } else {
        this.$router.replace(`/act-user/${this.activityId}?tab=${e}`);
      }
      this.query(undefined, true);
    },
    handleSwitchDetail(detail, flag = true) {
      this.operate = "check";
      this.curUserId = detail.userId;
      this.showDetail = flag;
    },
    clearSelected() {
      const ref = this.curTab === "1" ? this.$refs.tab1 : this.$refs.tab2;
      ref && ref.clearSelected();
    },
  },
  components: {
    // TableOperate,
    Pagination,
    // UserDetail,
    sendMsg,
    Tab1,
    Tab2,
  },
};
</script>

<style lang="less" scoped>
.upload-demo {
  display: inline-block;
}

.tag-trigger {
  height: 25px;
  line-height: 25px;
}
</style>
