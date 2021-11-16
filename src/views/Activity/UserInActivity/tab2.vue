<template>
  <div>
    <FyForm
      formRef="scoreForm"
      :formItems="formItemsOfScore"
      v-model:formValue="formValue"
      layout="inline"
      @query="$emit('query')"
      :onReset="onReset"
    >
      <template #scores>
        <div style="display: flex">
          <div class="all-dim-score">
            <div
              class="one-dim-score"
              v-for="(score, index) in formValue.scores"
              :key="score.key"
            >
              <a-select
                dropdownMatchSelectWidth
                v-model:value="score.dimensionalityCode"
                placeholder="请选择"
                style="margin-right: 10px"
                class="select-dim"
                :id="index"
                @change="(e) => handleDimScoreChange(e, index)"
              >
                <a-select-option
                  v-for="item in dimOptions.filter((v) => v.haveScore)"
                  :key="item.value"
                  :value="item.value"
                  :disabled="selectedDim.includes(item.value)"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
              <a-input
                v-model:value="score.scoreBegin"
                placeholder="最小值"
                style="min-width: 68px"
              />
              <p
                style="
                  width: 30px;
                  text-align: center;
                  white-space: nowrap;
                  height: 32px;
                  line-height: 32px;
                "
              >
                --
              </p>
              <a-input
                v-model:value="score.scoreEnd"
                placeholder="最大值"
                style="min-width: 68px"
              />
            </div>
          </div>
          <a-button
            type="dashed"
            style="width: 120px; margin-left: 10px"
            @click="addDimention"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            <a-icon type="plus" />分数区间
          </a-button>
        </div>
      </template>
      <template #matchValue v-if="withModel">
        <div class="flex">
          <a-input
            v-model:value="formValue.matchValueBegin"
            placeholder="最小值"
            suffix="%"
          />
          <p style="white-space: nowrap; line-height: 32px">--</p>
          <a-input
            v-model:value="formValue.matchValueEnd"
            placeholder="最大值"
            suffix="%"
          />
        </div>
      </template>
    </FyForm>
    <div class="operate-line">
      <!-- todo -->
      <a-button
        v-if="!hideContrast"
        @click="isSelectedOrNot(handleGoContrast)"
        type="primary"
        >交叉对比</a-button
      >
      <a-button
        type="primary"
        v-if="!hidePersonalReport"
        :disabled="!tableData.total"
        @click="handleDownloadReport()"
        :loading="reportLoading1"
        >下载个人报告</a-button
      >
      <a-button
        type="primary"
        :disabled="!tableData.total"
        v-if="verifyReportType === 1"
        @click="handleDownloadReport('recruitTrainingReportUrl', 2)"
        :loading="reportLoading2"
        >下载招聘报告</a-button
      >
      <a-button
        type="primary"
        :disabled="!tableData.total"
        v-if="verifyReportType === 2"
        @click="handleDownloadReport('recruitTrainingReportUrl', 2)"
        :loading="reportLoading2"
        >下载培训报告</a-button
      >
      <span style="margin: 0 10px !important">
        <a-tooltip placement="top">
          <template #title>
            <p>点击下载：已完成测评的全部成员分数（Excel表格）。</p>
            <p>数据量较大时，请耐心等候</p>
          </template>
          <a-button
            type="primary"
            @click="handleDownloadScore"
            :loading="scoreLoading"
            :disabled="!tableData.total"
            >下载全部分数</a-button
          >
        </a-tooltip>
      </span>
      <a-button type="primary" @click="sendReport" :loading="sendRepLoading"
        >发送报告</a-button
      >
    </div>
    <a-row>
      <a-col :span="22">
        <a-form-item label="用户信息展示列" style="margin-bottom: 0px">
          <a-checkbox-group
            size="mini"
            v-model:value="checkedInfoColumns"
            :options="
              columns
                .slice(0, 3)
                .map((v) => ({ label: v.title, value: v.dataIndex }))
            "
            @change="handleCheckGroupChange"
          >
          </a-checkbox-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="22">
        <a-form-item
          label="维度展示列"
          class="dims-box"
          :class="{ hideTag: !isOpenTag || dimNoChild }"
        >
          <template v-if="dimensionalitys.length && !dimNoChild">
            <a-checkbox-group
              size="mini"
              v-model:value="dimsCheckedMap[temp.code]"
              @change="handleCheckGroupChange"
              v-for="temp in dimensionalitys"
              :key="temp.code"
            >
              <a-checkbox :value="temp.code">
                <strong>{{ temp.name }}</strong>
              </a-checkbox>
              <!-- <a-divider direction="vertical" style="margin-right: -20px" /> -->
              <a-checkbox
                v-for="child in temp.children"
                :key="child.code"
                :value="child.code"
              >
                <span>{{ child.name }}</span>
              </a-checkbox>
            </a-checkbox-group>
            <a-checkbox
              label="全选"
              v-model:checked="allChecked"
              @change="handleAllCheck"
            >
              <strong>全选</strong>
            </a-checkbox>
          </template>
          <template v-if="dimensionalitys.length && dimNoChild">
            <a-checkbox-group
              size="mini"
              v-model:value="checkedColumns"
              @change="handleCheckGroupChange"
            >
              <a-checkbox
                v-for="child in dimensionalitys"
                :key="child.code"
                :value="child.code"
              >
                <span class="a-dropdown-link">
                  <span>{{ child.name }}</span>
                </span>
              </a-checkbox>
            </a-checkbox-group>
          </template>
        </a-form-item>
      </a-col>
      <a-button
        v-if="!dimNoChild"
        class="tag-trigger"
        type="link"
        @click="isOpenTag = !isOpenTag"
      >
        {{ isOpenTag ? "展开" : "收起" }}
        <i
          class="a-icon-arrow-up"
          :class="isOpenTag ? 'arrow-transition' : 'arrow-transition-down'"
        />
      </a-button>
    </a-row>
    <!-- 下面 curTab === 2 就挺蠢的  但是不加又报错 -->
    <FyTableWrap
      v-if="curTab === '2'"
      :selectedRowKeys="selectedId"
      @clearSelected="clearSelected"
    >
      <a-table
        rowKey="userId"
        bordered
        :scroll="{ x: true }"
        :columns="columns.filter((v) => v.visible)"
        :pagination="false"
        :dataSource="tableData.list"
        :loading="tableLoading"
        :row-selection="{
          selectedRowKeys: selectedId,
          onChange: onSelectChange,
        }"
        @change='handleTableChange'
      >
        <template
          v-for="col in columns.filter((v) => v.bigDim && v.slots)"
          :key="col.dataIndex"
          #[col.dataIndex]="{ text }"
        >
          <!-- {{ text.score }} -->
          <div class="big-dim-line">{{ text.score }}</div>
          <template v-if="Array.isArray(text.children)">
            <div
              class="lil-dim-line"
              v-for="it in text.children.filter((v) =>
                checkedColumns.includes(v.code)
              )"
              :key="it.code"
            >
              <div class="lil-dim-line__label">{{ it.name }}：</div>
              <div class="lil-dim-line__value">{{ it.score }}</div>
            </div>
          </template>
        </template>
        <template #report="{ record }">
          <div
            v-if="loadingId !== record.userId"
          >
            <a-button
              :loading="reportLoading1"
              v-if="!hidePersonalReport"
              type="link"
              @click="handleDownloadReport('reportUrl', 1, record)"
              >个人报告</a-button
            >
            <span
              v-if="verifyReportType"
              style="
                width: 1px;
                height: 12px;
                background: #dcdfe5;
                margin: 0 2px;
              "
            ></span>
            <a-button
              :loading="reportLoading2"
              v-if="verifyReportType === 1"
              type="link"
              @click="
                handleDownloadReport('recruitTrainingReportUrl', 2, record)
              "
              >招聘报告</a-button
            >
            <a-button
              :loading="reportLoading2"
              v-if="verifyReportType === 2"
              type="link"
              @click="
                handleDownloadReport('recruitTrainingReportUrl', 2, record)
              "
              >培训报告</a-button
            >
          </div>
          <a-spin v-else>
            <LoadingOutlined />
          </a-spin>
        </template>
        <template #operate="{ record }">
          <a-button
            v-if="!hidePersonalReport"
            type="link"
            @click="handleSwitchCheckReport(record.reportUrl)"
            >查看个人报告</a-button
          >
          <a-button
            v-if="verifyReportType === 1"
            type="link"
            @click="handleSwitchCheckReport(record.recruitTrainingReportUrl)"
            >查看招聘报告</a-button
          >
          <a-button
            v-if="verifyReportType === 2"
            type="link"
            @click="handleSwitchCheckReport(record.recruitTrainingReportUrl)"
            >查看培训报告</a-button
          >
          <a-button type="link" @click="handleSwitchStar(record)">{{
            record.starFlag === 2 ? "标星" : "取消标星"
          }}</a-button>
        </template>
      </a-table>
    </FyTableWrap>
  </div>
</template>

<script>
import tab_mixin from "./tab_mixin";
import { formItemsOfScore, columns } from "./options";
import FyTableWrap from "@/components/FyTableWrap/table.vue";
import {
  showMessage,
  assignObj,
  trimFormValue,
  deleteEmptyField,
  showNotification,
} from "@/utils/utils";
import axios from "axios";
import { get } from '@/api/request'
import subject from "@/api/subject";
import {
  isBindingModal,
  dimensionality,
  getCompareByUserId,
  verifyType,
} from "@/api/activity";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { mapGetters } from "vuex";
const env = import.meta.env

export default {
  mixins: [tab_mixin],
  data() {
    return {
      verifyReportType: null, // 判断是招聘报告还是培训报告
      dimensionalitys: [],
      selectedDim: [],
      selectedId: [], // 选择的用户 id
      selectedItem: [], // 选择的用户项
      dimOptions: [], // 维度选项
      withModel: false, // 是否有模型
      checkedColumns: [], // dimNoChild 选中展示列
      dimsCheckedMap: {}, // !dimNoChild 多个维度 checkboxGroup 的 v-model 数组对象 这里修改是因为 Antd 和 Element 中 checkboxGroup 选中逻辑不同
      existReportInActivity: true, // 本活动有没有详细报告
      formItemsOfScore: JSON.parse(JSON.stringify(formItemsOfScore)),
      columns: JSON.parse(JSON.stringify(columns)),
      hideContrast: true,
      reportLoading1: false,
      reportLoading2: false,
      hidePersonalReport: true,
      allChecked: true,
      isOpenTag: false,
      loadingId: "",
      checkedInfoColumns: ["idNumber", "name", "endAt"],
    };
  },
  computed: {
    ...mapGetters(["blacklistInNewReport", "info"]),
  },
  props: {
    formValue: {
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Object,
      default: () => ({}),
    },
    tableLoading: {
      type: Boolean,
    },
    curTab: {
      type: String,
    },
  },
  created() {
    const idInState = this.info && this.info.companyId;
    const companyId = idInState || localStorage.getItem("hr-system").companyId;
    // 不给用交叉对比功能的公司 12 => 好未来
    const contrastBlackList = [12];
    this.hideContrast = contrastBlackList.includes(companyId * 1);
    // 没有个人报告的公司 如：90000001 => 智联。 智联单独定制报告(招聘)
    const personalReportBlackList = [90000001];
    this.hidePersonalReport = personalReportBlackList.includes(companyId * 1);
  },
  mounted() {
    this.dimOptions = [];
    this.handleFetchDimOptions();
    this.handleVerifyType();
    this.activityWithModel()
  },
  methods: {
    handleDimScoreChange(value, index) {
      this.selectedDim[index] = value;
    },
    handleCheckGroupChange(checked) {
      // log('####', checked, this.dimsCheckedMap)
      const dimChild = this.dimOptions.filter((item) => item.dimChild);
      this.handleConcatChecked()
      this.triggerColVisible()
      // 不是所有子维度选中状态  就把全选框设置为false
      this.allChecked = dimChild.every((item) => this.checkedColumns.includes(item.value));
    },
    // 多维度合并 checked
    handleConcatChecked() {
      let _checked = []
      if (!this.dimNoChild) {
        Reflect.ownKeys(this.dimsCheckedMap).forEach(v => {
          _checked = _checked.concat(this.dimsCheckedMap[v])
        })
        this.checkedColumns = _checked
      }
    },
    triggerColVisible() {
      this.columns.forEach((item) => {
        // 右边操作列不受影响
        if (item.fixed === 'right') return
        item.visible = this.checkedColumns.concat(this.checkedInfoColumns).includes(item.dataIndex);
      })
    },
    // 全选按钮
    handleAllCheck() {
      if (this.allChecked) {
        this.dimOptions.forEach((item) => {
          if (!this.checkedColumns.includes(item.value)) {
            if (item.dimChild) {
              // 子维度
              this.dimsCheckedMap[item.parent].push(item.value)
            } else {
              this.checkedColumns.push(item.value)
            }
          }
        })
      } else {
        Reflect.ownKeys(this.dimsCheckedMap).forEach(v => {
          // 只留一级维度
          this.dimsCheckedMap[v] = [v]
        })
      }
      this.handleConcatChecked()
      this.triggerColVisible()
    },
    activityWithModel() {
      isBindingModal(this.activityId).then((res) => {
        const { success, result } = res;
        if (success) {
          this.withModel = result
          if (result === false) {
            this.formItemsOfScore = this.formItemsOfScore.filter((v) => v.slot !== "matchValue");
          }
          localStorage.setItem("withModel", result);
        }
      })
    },
    // 表格排序 Antdv 同时只支持一个字段的排序
    // https://2x.antdv.com/components/table-cn#components-table-demo-reset-filter
    handleTableChange(a, b, sortRecord) {
      const { field, order } = sortRecord
      const orderMap = {
        ascend: 1,
        descend: 2
      }
      let obj = {}
      if (order) {
        if (field === 'name') {
          obj.nameOrderType = orderMap[order]
        } else if (field === 'endAt') {
          obj.completeTimeOrderType = orderMap[order]
        }
      }
      this.$emit('query', obj)
    },
    clearSelected() {
      this.selectedId = [];
    },
    addDimention() {
      // 添加维度分数区间
      this.formValue.scores.push({
        scoreBegin: "",
        scoreEnd: "",
        dimensionalityCode: "",
        key: this.formValue.scores.length,
      });
    },
    handleFetchDimOptions() {
      dimensionality(this.activityId).then((res) => {
        const { result, success } = res;
        if (success) this.dimensionalitys = result;
        this.dimensionalitys.forEach((item, idx) => {
          // 维度填充到 table 的列中
          this.checkedColumns.push(item.code);
          // 这里直接 push 布局会有问题, 并不是很智能, 需要用 splice
          this.columns.splice(3 + idx, 0, {
            dataIndex: item.code,
            title: item.name,
            bigDim: true,
            visible: true,
            value: item,
            width: "170px",
            slots: { customRender: item.code },
          });
          // 填充 dimOptions 到维度选择框
          this.dimOptions.push({
            value: item.code,
            label: item.name,
            haveScore: item.haveScore, // 有无分数
          });
          // item.children
          if (Array.isArray(item.children)) {
            // Vue3 使用了 Proxy 就不需要 Vue.$set 了
            this.dimsCheckedMap[item.code] = [item.code]
            item.children.forEach((v) => {
              this.dimsCheckedMap[item.code].push(v.code);
              this.dimOptions.push({
                value: v.code,
                label: v.name,
                haveScore: v.haveScore,
                dimChild: true,
                parent: item.code,
              })
            })
          }
        })
        // 都是一级维度
        const noChild = this.dimensionalitys.every((item) => !item.children);
        noChild && (this.dimNoChild = true);
        this.handleConcatChecked()
      });
    },
    // 查询本活动的报告类型
    handleVerifyType() {
      verifyType(this.activityId).then((res) => {
        const { result, success } = res;
        if (success) {
          this.verifyReportType = result;
        }
      });
    },
    // 是否有祥报
    isExistReportInThisActivity() {
      if (this.tableData.list?.length) {
        const demo = this.tableData.list[0];
        const { havePdfReport } = demo;
        this.existReportInActivity = havePdfReport;
      }
    },
    // 下载报告
    // 2021.11.16 发现个 bug 如果文件名重复, 前者会被覆盖掉
    handleDownloadReport(type = "reportUrl", loadingNum = 1, oneRow) {
      if (!this.existReportInActivity)
        return showMessage("error", "本活动暂无详报");
      if (!oneRow && !this.selectedItem.length)
        return showMessage("error", "请选择下载的用户");
      const itemArr = oneRow
        ? [{ url: oneRow[type], name: oneRow.name }]
        : this.selectedItem.map((v) => ({ url: v[type], name: v.name }));
      const zipName =
        itemArr.length === 1
          ? itemArr[0].name
          : this.handleGetReportZipName(type);
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      const whoWithoutRep = itemArr.filter((v) => !v.url).map((v) => v.name);
      if (whoWithoutRep.length) {
        return showNotification({
          description: `${whoWithoutRep.slice(0, 5).join("、")}等${
            whoWithoutRep.length
          }人报告尚未生成`,
          message: "部分报告没有生成",
          duration: 3,
        });
      }
      if (itemArr.length > 30) {
        showNotification({
          message: "数据量较大",
          description: `将要下载${itemArr.length}份报告，这可能会花费一些时间`,
          duration: 3,
        });
      }
      this[`reportLoading${loadingNum}`] = true;
      const nameMap = {}
      itemArr.forEach((item) => {
        const promise = this.handleDownloadOne(item.url).then((res) => {
          // jszip version "3.5.0" => "3.7.1" 需要下面解构 data
          const { data } = res;
          // fix: 重名覆盖问题
          nameMap[item.name] = nameMap[item.name] ? (nameMap[item.name] + 1) : 1
          let count = nameMap[item.name]
          const _name = count > 1 ? item.name + `(${count - 1})` : item.name
          let file_name =
            _name + "-" + this.handleGetReportZipName(type) + ".pdf";
          zip.file(file_name, data, {
            binary: true,
          });
          cache[file_name] = data;
        });
        promises.push(promise);
      });
      Promise.all(promises)
        .then(() => {
          zip
            .generateAsync({
              type: "Blob",
            })
            .then((content) => {
              // 生成二进制流
              FileSaver.saveAs(content, `${zipName}.zip`); // 利用file-saver保存文件
            })
            .finally(() => (this[`reportLoading${loadingNum}`] = false));
        })
        .catch((err) => {
          this[`reportLoading${loadingNum}`] = false;
          return err;
        });
    },
    // 下载单个报告
    handleDownloadOne(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, { responseType: "arraybuffer" })
          .then((res) => {
            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      });
    },
    handleGetReportZipName(type) {
      let typeCopy = type;
      if (typeCopy === "recruitTrainingReportUrl") {
        if (this.verifyReportType === 1) {
          typeCopy = "recruit";
        } else if (this.verifyReportType === 2) {
          typeCopy = "train";
        }
      }
      const nameMap = {
        reportUrl: "个人报告",
        recruit: "招聘报告",
        train: "培训报告",
      };
      return nameMap[typeCopy] || "报告";
    },
    // 查看报告
    handleSwitchCheckReport(reportUrl) {
      if (!reportUrl) return showMessage("error", "该用户暂时没有报告");
      const a = document.createElement("a");
      a.href = reportUrl;
      a.target = "_blank";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // 下载分数
    async handleDownloadScore() {
      this.scoreLoading = true;
      await get(`/hr/report/export`, {
          activityId: this.activityId,
          userIds: this.selectedId.join(","),
          responseType: "blob",
        })
        .then(
          (res) => {
            const blob = new Blob([res]);
            const elink = document.createElement("a");
            elink.download = "scores.xlsx";
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
      this.scoreLoading = false;
    },
    onReset() {
      this.selectedDim = [];
      const keys = Object.keys(this.formValue.scores[0]);
      this.formValue.scores.forEach((item) => {
        keys.forEach((temp) => (item[temp] = ""));
      });
      this.formValue.matchValueBegin = "";
      this.formValue.matchValueEnd = "";
      // this.nameOrderType = null;
      // this.completeTimeOrderType = null;
      // this.$emit("query", { nameOrderType: this.nameOrderType, completeTimeOrderType: this.completeTimeOrderType });
    },
  },
  components: {
    FyTableWrap,
  },
};
</script>

<style lang="less" scoped>
.all-dim-score {
  .one-dim-score {
    display: flex;
    margin-bottom: 10px;
  }
}
.dims-box {
  max-height: 38px;
  overflow: hidden;
  transition: max-height 0.2s;
}
.hideTag {
  max-height: 500px;
}
.big-dim-line {
  font-weight: bold;
}
.lil-dim-line {
  display: flex;
}
</style>
