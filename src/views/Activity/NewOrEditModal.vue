<template>
  <a-modal :title="myOperate === 'edit' ? '编辑活动' : myOperate === 'new' ? '新建活动' : '查看详情'" :visible="visible" okText="确定" :width="800" cancelText="取消" :maskClosable="false" :confirm-loading="confirmLoading" @ok="onSubmit('formRef')" @cancel="$emit('update:visible', false)">
    <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" ref="formRef" :rules="rules" class="modalform">
      <div class="h3">
        基本信息
        <a-button type="link" style="float: right" v-if="myOperate !== 'new'" @click="() => handleSwitchOperate(this.myOperate)">{{ myOperate === "check" ? "编辑" : "取消编辑" }}</a-button>
      </div>
      <a-form-item label="活动名称:" name="name">
        <a-input 
          v-model:value="form.name"
          autocomplete="off" 
          :disabled="myOperate === 'check'" 
          :placeholder="handlePlaceholder('请输入活动名称')"
        ></a-input>
      </a-form-item>
      <a-form-item label="活动时间:" name="time">
        <a-range-picker 
          :getCalendarContainer="(e) => e.parentNode" 
          style="width: 100%" 
          :placeholder="['开始时间', '结束时间']" 
          v-model:value="form.time" 
          :disabled="myOperate === 'check'" 
          valueFormat="YYYY-MM-DD HH:mm:ss" 
          format="YYYY-MM-DD HH:mm:ss">
        </a-range-picker>
      </a-form-item>
      <a-form-item label="活动备注:">
        <a-input 
          v-model:value="form.remark" 
          :disabled="myOperate === 'check'" 
          :placeholder="handlePlaceholder('请输入备注')"
        ></a-input>
      </a-form-item>
      <a-divider />
      <div class="h3">基本属性设定</div>
      <a-form-item label="是否公开:" name="publicFlag">
        <a-radio-group :disabled="myOperate === 'check'" v-model:value="form.publicFlag">
          <a-radio :value="1">
            公开
          </a-radio>
          <a-radio :value="2">
            非公开
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="添加管理员:">
        <a-select v-model:value="form.adminUserIds" :placeholder="handlePlaceholder('管理员可编辑和查看活动')" mode="multiple" :disabled="myOperate === 'check'" :getPopupContainer="(e) => e.parentNode">
          <a-select-option v-for="item in options" :key="item.account" :value="item.userId">{{ item.name || item.account }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="添加测评产品:" required name="modelIds">
        <a-select v-model:value="form.modelIds" :placeholder="handlePlaceholder('请选择')" style="width: 100%" :disabled="myOperate !== 'new'" :getPopupContainer="(e) => e.parentNode" @change="proChange">
          <a-select-option v-for="item in gameOptions" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 添加场景 -->
      <a-form-item v-if="!blacklistInNewReport.includes(info.companyId) && !noNeedUseCase.includes(form.modelIds)" label="使用场景:" required name="useCase">
        <a-select v-model:value="form.useCase" @change="handleSelectUseCase" :disabled="myOperate !== 'new'" :placeholder="handlePlaceholder('请选择使用场景')" style="width: 100%" :getPopupContainer="(e) => e.parentNode">
          <a-select-option v-for="item in sceneOptions" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="测评人群层级:" required name="level">
        <a-select v-model:value="form.level" :placeholder="handlePlaceholder('请选择')" style="width: 100%" :disabled="myOperate === 'check'" :getPopupContainer="(e) => e.parentNode">
          <a-select-option key="1" :value="1">基层</a-select-option>
          <a-select-option key="2" :value="2">中层管理</a-select-option>
          <a-select-option key="3" :value="3">高层管理</a-select-option>
          <a-select-option key="4" :value="4">通用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="登录必选信息:" required name="required">
        <a-select v-model:value="form.required" :placeholder="handlePlaceholder('请选择')" style="width: 100%" mode="multiple" :disabled="myOperate === 'check'" :getPopupContainer="(e) => e.parentNode">
          <a-select-option v-for="item in loginFields" :disabled="Array.isArray(form.notRequired) && form.notRequired.includes(item.key)" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="登录选填信息:" name="notRequired">
        <a-select v-model:value="form.notRequired" :placeholder="handlePlaceholder('请选择')" style="width: 100%" mode="multiple" :disabled="myOperate === 'check'" :getPopupContainer="(e) => e.parentNode">
          <a-select-option v-for="item in loginFields" :disabled="Array.isArray(form.required) && form.required.includes(item.key)" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-divider />
      <div class="h3">受测者数量设定</div>
      <a-form-item label="数量:" name="limitFlag">
        <a-radio-group :disabled="myOperate === 'check'" v-model:value="form.limitFlag">
          <a-radio :value="1">
            不限数
          </a-radio>
          <a-radio :value="2">
            限数
          </a-radio>
        </a-radio-group>
        <a-input-number :disabled="myOperate === 'check'" v-model:value="form.limitNum" v-if="form.limitFlag === 2" />
      </a-form-item>
      <a-divider />
      <div class="h3">受测者查看报告权限</div>
      <a-form-item label="权限:" name="testerReportAuthority">
        <a-radio-group :disabled="myOperate === 'check' || productCode === 3" v-model:value="form.testerReportAuthority">
          <a-radio :value="1">
            可查看
          </a-radio>
          <a-radio :value="2">
            不可查看
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { fetchAllModels, newActivity, editActivity, fetchAllAdmin, fetchModelsInNewAct, fetchScene } from "@/api/activity";
import { assignObj, showMessage, trimFormValue } from "@/utils/utils";
import { loginFields } from "@/utils/const";
import { mapGetters } from "vuex";
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  data() {
    return {
      options: [],
      sceneOptions: [],
      loginFields,
      gameOptions: [],
      myOperate: "",
      modelOptions: [],
      // 不用区分使用场景的几个关卡
      noNeedUseCase: [],
      productCode: null,
      confirmLoading: false,
    };
  },
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    detail: {
      type: Object,
    },
    operate: {
      type: String,
    },
  },
  computed: {
    ...mapGetters(["blacklistInNewReport", "info"]),
  },
  created() {
    // blacklist
    if (this.blacklistInNewReport.includes(this.info.companyId)) {
      delete this.rules.useCase;
      delete this.form.useCase;
    }
  },
  setup(props, context) {
    const formRef = ref()
    const rules =  {
      name: [
        { required: true, message: "请输入活动名称", trigger: "blur" },
        { whitespace: true, message: "请输入活动名称", trigger: "blur" },
      ],
      time: [
        { type: 'array', validator: validateTime, trigger: "change" },
      ],
      useCase: [{ type: 'number', required: true, message: "请选择使用场景", trigger: "change" }],
      publicFlag: [{ type: 'number', required: true, message: "请选择是否公开", trigger: "change" }],
      testerReportAuthority: [{ type: 'number', required: true, message: "请选择查看权限", trigger: "blur" }],
      level: [{ type: 'number', required: true, message: "请选择测评人群层级", trigger: "blur" }],
      modelIds: [{ type: 'number', required: true, message: "请选择测评产品", trigger: "blur" }],
      limitFlag: [{ type: 'number', required: true, message: "请选择数量设定", trigger: "blur" }],
      required: [
        { type: 'array', validator: validateRequired, trigger: "change" },
        { type: 'array', required: true, message: "请选择登录必选信息", trigger: "change" },
      ],
    }
    const form = reactive({
      remark: "",
      name: "",
      time: [],
      modelIds: "",
      publicFlag: undefined,
      limitFlag: "",
      limitNum: "",
      testerReportAuthority: undefined,
      adminUserIds: [],
      id: "",
      level: undefined,
      useCase: undefined,
      required: [],
      notRequired: [],
    })
    
    // 表单字段验证
    function validateTime(rule, value) {
      if ((Array.isArray(value) && !value.length) || value[0] === "" || value[1] === "") {
        return Promise.reject("请选择活动时间");
      }
      return Promise.resolve(1);
    }
    function validateRequired(rule, value) {
      if (!value.includes("idNumber") && !value.includes("phone")) {
        return Promise.reject("身份证/护照 和 手机号必选一项作为唯一标识");
      } else if (!value.includes("userName")) {
        return Promise.reject("姓名为必选项");
      }
      return Promise.resolve()
    }
    return {
      form,
      formRef,
      rules,
    }
  },
  methods: {
    onSubmit() {
      if (this.myOperate === "check") return this.$emit("update:visible", false);
      const onFormSubmit = this.myOperate === "edit" ? editActivity : newActivity;
      const message = this.myOperate === "new" ? "新建活动成功" : "活动修改成功";
      this.$refs.formRef.validateFields().then(res => {
        // log('结果', res)
        const body = trimFormValue(assignObj(this.form));
        if (body.time) {
          body.startTime = body.time[0];
          body.endTime = body.time[1];
          delete body.time;
        }
        this.confirmLoading = true;
        body.activityLoginOptionParam = {};
        Array.isArray(body.required) && body.required.forEach((item) => (body.activityLoginOptionParam[item] = 1));
        Array.isArray(body.notRequired) && body.notRequired.forEach((item) => (body.activityLoginOptionParam[item] = 2));
        delete body.required;
        delete body.notRequired;
        this.noNeedUseCase.includes(body.modelIds) && delete body.useCase;
        onFormSubmit(body)
          .then((res) => {
            if (res.success) {
              this.$emit("update:visible", false);
              this.$emit("query");
              showMessage("success", message);
            }
          })
          .finally(() => (this.confirmLoading = false));
        return Promise.resolve()
      }, err => log('错误: 表单信息不完整', err.values))
    },
    // 选择测评产品
    proChange(ev) {
      const res = this.gameOptions.filter((v) => v.id === ev);
      this.productCode = res[0].code;
    },
    handleSelectUseCase(val) {
      if (val) {
        showMessage("warning", "活动新建后使用场景不可修改");
      }
    },
    handleSwitchOperate(status) {
      status === "check" ? (this.myOperate = "edit") : (this.myOperate = "check")
    },
    handlePlaceholder(text) {
      return this.myOperate === "check" ? "" : text;
    },
  },
  mounted() {
    fetchAllModels().then((res) => {
      if (!res.success) return;
      if (res.result && res.result.length > 0) {
        res.result.forEach((element) => {
          element.name = `${element.name}（剩余数量：${element.leftAmount}）`
        });
      }

      this.gameOptions = res.result;
      this.noNeedUseCase = res.result.filter((v) => !v.useCaseFlag).map((v) => v.id);
      // 回填 productCode
      if (this.form.modelIds) {
        const result = this.gameOptions.filter((v) => v.id === this.form.modelIds);
        this.productCode = result[0].code;
      }
    });
    fetchAllAdmin().then((res) => {
      this.options = res.result;
    });
    // 场景列表
    fetchScene().then((res) => {
      this.sceneOptions = res.result;
    });
    fetchModelsInNewAct().then((res) => {
      this.modelOptions = res.result;
      this.modelOptions.unshift({ id: -1, name: "无" });
    });
  },
  watch: {
    visible(val) {
      if (val) {
        this.myOperate = this.$props.operate;
        this.form.testerReportAuthority = 2; // 默认选中
        if (this.operate !== "new") {
          Object.keys(this.form).forEach((item) => {
            if (item === "time") {
              this.form[item] = [this.detail.startTime, this.detail.endTime];
            } else if (item === "modelIds") {
              this.form[item] = this.detail[item].length === 1 ? this.detail[item][0] : this.detail[item];
            } else {
              this.form[item] = this.detail[item];
            }
          });
          
          this.detail.activityLoginOptionVO &&
            Object.keys(this.detail.activityLoginOptionVO).forEach((v) => {
              if (this.detail.activityLoginOptionVO[v] === 1) {
                this.form.required = this.form.required || [];
                this.form.required.push(v);
              }
              if (this.detail.activityLoginOptionVO[v] === 2) {
                this.form.notRequired = this.form.notRequired || [];
                this.form.notRequired.push(v);
              }
            });
        }
        if (this.operate === "new") this.form.required = ["userName"];
      } else {
      }
    },
  },
});
</script>

<style lang="less" scoped>
.h3 {
  font-weight: 1000;
  font-size: 16px;
  margin-bottom: 20px;
}
.dialog-footer {
  padding: 8px;
  border-top: #dddddd 1px solid;
}
.modalform {
  padding: 0;
}
</style>
