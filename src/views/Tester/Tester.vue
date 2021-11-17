<template>
  <div class="tester-page">
    <a-card>
      <FyForm
        :formItems="formItems"
        v-model:formValue="formValue"
        layout="inline"
        @query="query"
      />
      <div class="operate-line">
        <a-button
          type="primary"
          style="margin-right: 10px"
          :loading='exportLoading'
          @click="exportUserInfo"
          >批量导出用户信息</a-button
        >
      </div>
      <FyTableWrap 
        :selectedRowKeys="selectedId"
        @clearSelected='onSelectChange([])'
        :tableData='tableData'
        @query='query'
      >
        <a-table
          rowKey="userId"
          bordered
          defaultExpandAllRows
          :key='forUpdateKey'
          :scroll="{ x: true }"
          :columns="columns"
          childrenColumnName="childrenList"
          :pagination="false"
          :dataSource="tableData.list"
          :loading="tableLoading"
          :row-selection="{
            selectedRowKeys: selectedId,
            onChange: onSelectChange,
          }"
        >
          <template #download="{ record }">
            <div class="download">
              <a-button
                type="link"
                v-if="record.reportUrl"
                @click="handleDownload('reportUrl', record.reportUrl, record)"
                >下载个人报告</a-button
              >
              <a-button
                type="link"
                v-if="record.recruitTrainingReportPath"
                @click="
                  handleDownload(
                    'recruitTrainingReportPath',
                    record.recruitTrainingReportPath,
                    record
                  )
                "
                >下载{{ record.useCase === 1 ? "招聘" : "培训" }}报告</a-button
              >
            </div>
          </template>
          <template #status="{ record }">
            <span v-if="record.gameStatus == 1">未开始</span>
            <span v-if="record.gameStatus == 2">进行中</span>
            <span v-if="record.gameStatus == 3">已完成</span>
          </template>
          <template #operate="{ record }">
            <a-button type="link" @click="handleCheckTester(record)">查看</a-button>
          </template>
        </a-table>
      </FyTableWrap>
      <TestDetail :curId='curId' :activityId='curActId' v-model:visible='visibleOfDetail' @query='query' />
    </a-card>
  </div>
</template>

<script>
import subject from "@/api/subject"
import { formItems, columns } from "./options"
import TestDetail from './TestDetail.vue'
import FileSaver from "file-saver"
import { showMessage } from '@/utils/utils'
export default {
  data() {
    this.formItems = formItems
    this.columns = columns
    return {
      formValue: {
        name: "",
        idNumber: "",
        jobNumber: "",
        phone: "",
      },
      tableLoading: false,
      tableData: {
        list: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      curId: '',
      exportLoading: false,
      visibleOfDetail: false,
      forUpdateKey: 1, // 从后台取到数据后去手动的修改下这个 key 让组件更新 使得 defaultExpandAllRows 生效
      selectedId: [],
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query(params) {
      this.tableLoading = true
      subject
        .datalist({
          ...this.formValue,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          ...params,
        })
        .then((res) => {
          const { result, success } = res
          if (success) {
            this.tableData = result
            this.forUpdateKey++
          }
        })
        .finally(() => (this.tableLoading = false))
    },
    onSelectChange(selectedRowKeys) {
      this.selectedId = selectedRowKeys
    },
    handleCheckTester(record) {
      this.curId = record.userId
      this.curActId = record.activityId
      this.visibleOfDetail = true
    },
    handleDownload(type = "reportUrl", url, row) {
      console.log(row, type)
      const name = this.handleGetName(type, row)
      // saveAs 没有 callback, 我并不是很认可
      FileSaver.saveAs(url, `${row.remark} - ${name}.pdf`)
    },
    handleGetName(type, row) {
      const nameObj = {
        reportUrl: "个人报告",
        recruitTrainingReportPath: `${row.useCase === 1 ? "招聘" : "培训"}报告`,
      }
      return nameObj[`${type}`]
    },
    exportUserInfo() {
      if (!this.selectedId?.length) {
        return showMessage('info', '请选择至少一项要导出的用户信息')
      }
      const params = {
        responseType: "blob",
        userIds: this.selectedId.join(","),
      }
      this.exportLoading = true
      subject.downLoadManage(params).then(res => {
        const blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "用户信息.xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }).finally(() => this.exportLoading = false)
    },
  },
  components: {
    TestDetail,
  }
}
</script>

<style></style>
