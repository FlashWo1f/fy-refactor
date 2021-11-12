<template>
  <div class='tab1'>
    <FyForm 
      formRef="userForm" 
      :formItems="formItems" 
      v-model:formValue="formValue" 
      layout="inline" 
      @query="$emit('query')" 
    />
    <div class="operate-line">
      <a-upload class="upload-demo" :action="uploadUrl()" :headers="headers" :on-success="uploadSuccess" :on-error="uploadFail" :data="exactData" :before-upload="beforeUploadFile" accept=".xlsx">
        <a-button id="upBtn" type="primary" style="display: none">点击上传</a-button>
      </a-upload>
      <a-popconfirm title="已经有模板了嘛" ok-text="是的，直接上传" canca-text="下载模板" @confirm="confirmUploadTester" @cancel="downloadTemplate">
        <a-button type="primary" :loading="uploadLoading">点击上传</a-button>
      </a-popconfirm>
      <a-button type="default" @click="handleDownloadInfo" :loading="infoLoading">下载用户信息</a-button>
      <a-button type="primary" @click="sendInfo('','发送通知')" style="margin-left:10px">发送通知 </a-button>
      <a-button type="default" @click="sendInfo('','发送提醒')" style="margin-left:10px">发送提醒（未完成测评用户）</a-button>
      <a-tooltip placement="top">
        <template #title>
          <span>未选择用户时默认发送至本活动下所有未开始测评的用户</span>
        </template>
        <a-button type="primary" @click="sendSms" style="margin-left:10px" :loading="smsLoading">发送短信通知</a-button>
      </a-tooltip>
    </div>
    <FyTableWrap
      ref="tableRef"
      :selectedRowKeys='selectedRowKeys'
      @clearSelected='clearSelected'
    >
      <a-table 
        rowKey='userId'
        bordered 
        :columns="tableColumns"
        :pagination='false'
        :dataSource='tableData.list'
        :loading='tableLoading'
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #order='{ index }'>
          {{ (tableData.pageNo - 1) * tableData.pageSize + index + 1 }}
        </template>
        <template #operate="{ record }">
          <a-button type="link" @click.stop="handleSwitchDetail(record)">查看</a-button>
          <a-button @click.stop="handleSwitchStar(record)" type="link">{{ record.starFlag === 2 ? "标星" : "取消标星" }}</a-button>
          <a-button type="link" @click="sendInfo(record.userId)" v-if="record.gameStatus == '进行中'">发送提醒</a-button>
        </template> 
      </a-table>
    </FyTableWrap>
    <UserDetail v-if="showDetail" :visible="showDetail" :handleSwitchModal="handleSwitchDetail" :id="curUserId" :operate="operate" @query="$emit('query')" />
  </div>
</template>

<script>
import tab_mixin from './tab_mixin'
import { tableColumns, formItems } from './options'
import { showMessage, assignObj, trimFormValue, deleteEmptyField, showNotification } from "@/utils/utils";
import { sendSmsToTester } from "@/api/activity";
import axios from 'axios'
import FyTableWrap from '@/components/FyTableWrap/table.vue'
import UserDetail from "./UserDetail.vue"
export default {
  data() {
    this.tableColumns = tableColumns
    this.formItems = formItems
    return {
      operate: "",
      infoLoading: false,
      smsLoading: false,
      uploadLoading: false,
      selectedId: [],
      exactData: { activityId: "" },
      headers: {},
      curUserId: '',
      showDetail: false,
      selected: [],
      selectedRowKeys: [],
    }
  },
  mounted() {
    this.exactData = {
      activityId: this.activityId,
    };
    this.headers = {
      "x-access-token": this.token,
      "x-user-id": this.userId,
      "x-user-type": 2,
    }
  },
  mixins: [tab_mixin],
  props: {
    formValue: {
      type: Object,
      default: () => ({})
    },
    sendTitle: {
      type: String,
    },
    tableData: {
      type: Object,
      default: () => ({})
    },
    curTab: {
      type: String,
    },
    tableLoading: {
      type: Boolean,
    }
  },
  components: {
    FyTableWrap,
    UserDetail,
  },
  methods: {
    handleSwitchDetail(detail, flag = true) {
      this.operate = "check";
      this.curUserId = detail.userId;
      log('!@#!@3', this.curUserId)
      this.showDetail = flag;
    },
    clearSelected() {
      this.selectedRowKeys = []
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    getRowKeys(row) {
      return row.userId
    },
    sendInfo(item, title) {
      this.$emit('update:sendTitle', '发送提醒')
      if (this.selectedId.length === 0 && !item) {
        showMessage('info', "请先选择至少一名用户");
        return;
      }
      if (typeof(item) === 'number') {
        this.selectedId = [item];
      }
      this.$store.commit('SET_SELECTED_ARR', this.selectedId)
      this.$store.commit('SET_SEND_MODAL', true)
      this.$store.commit('SET_SEND_TITLE', title)
    },
    sendSms() {
      this.smsLoading = true;
      sendSmsToTester({
        activityId: this.activityId,
        userIds: this.selectedId,
      }).then(
        (res) => {
          res.success && showMessage("success", "发送成功！");
          this.smsLoading = false;
        },
        (err) => {
          this.smsLoading = false;
          err && showMessage("error", err);
        }
      );
      console.log(this.selectedId);
    },
    uploadUrl() {
      return `${process.env.VUE_APP_FREFIX_URL}/hr/participant/good/future/upload`;
    },
    handleOneSelect(selection, row) {
      console.log('selection', selection, row)
    },
    async handleDownloadInfo() {
      this.infoLoading = true;
      const statusSet = Array.isArray(this.formValue.statusSet) ? this.formValue.statusSet.join(",") : ''
      await axios
        .get(`${process.env.VUE_APP_FREFIX_URL}/hr/participant/good/future/download`, {
          responseType: "blob",
          activityId: this.activityId,
          userIds: this.selectedId.join(","),
          ...this.formValue,
          statusSet,
        })
        .then(
          (res) => {
            const blob = new Blob([res]);
            const elink = document.createElement("a");
            elink.download = "info.xlsx";
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          },
          (err) => {
            if (err) showMessage("error", "下载失败");
          }
        );
      this.infoLoading = false;
    },
    confirmUploadTester() {
      const upBtn = document.getElementById("upBtn");
      upBtn.click();
    },
    uploadSuccess({ success, error }) {
      success ? showMessage("success", "上传成功") : showNotification({ message: "上传失败", description: error || "填写字段有误导致上传失败，请检查" });
      this.$emit('query')
      this.uploadLoading = false;
    },
    downloadTemplate() {
      // 下载模板
      window.open("https://static.upupfarm.com/excel/4/%E7%94%A8%E6%88%B7%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx", "_blank");
    },
    uploadFail() {
      showMessage("error", "上传失败");
      this.uploadLoading = false;
    },
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        showMessage("warning", "只能上传后缀是.xlsx的文件");
        // return false 阻断上传
        return false;
      }
      if (size > 5) {
        showMessage("warning", "文件大小不得超过5M");
        return false;
      }
      this.uploadLoading = true;
    },
  },
}
</script> 

<style>

</style>