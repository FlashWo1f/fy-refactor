<template>
  <a-modal
    :visible="visible"
    :title="myOperate === 'check' ? '用户详情': '编辑用户'"
    @ok="onSubmit()"
    okText="确定"
    cancelText="取消"
    @cancel="handleSwitchModal({}, false)"
    width="850px"
  >
    <a-form
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="myForm"
      :rules="rules"
      class="modalform"
    >
      <div style="text-align: right; margin-bottom: 15px"><a-button
        type="link"
        v-if="myOperate !== 'new'"
        @click="() => handleSwitchOperate(this.myOperate)"
      >{{ myOperate === "check" ? '编辑' : '取消编辑' }}</a-button></div>
      <a-row>
        <a-col :span="12">
          <a-form-item required label="姓名:" name="name">
            <a-input v-model:value="form.name" autocomplete="off" :disabled="myOperate === 'check'"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="证件号">
            <a-row>
              <a-col :span="9" style="margin-right: 10px">
                <a-select v-model:value="form.idType" :placeholder="handlePlaceholder('证件类型')" :disabled="myOperate === 'check'">
                  <a-select-option :value="1">身份证</a-select-option>
                  <a-select-option :value="2">护照</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="14">
                <a-form-item name="idNumber" style="margin-bottom: 0">
                  <a-input v-model:value="form.idNumber" :placeholder="handlePlaceholder('请输入证件号')" :disabled="myOperate === 'check'" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="工号:" name="jobNumber">
            <a-input v-model:value="form.jobNumber" autocomplete="off" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入工号')"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别:" name="gender">
            <a-select v-model:value="form.gender" :placeholder="handlePlaceholder('请选择性别')" :disabled="myOperate === 'check'">
              <a-select-option label="男" :value="1">男</a-select-option>
              <a-select-option label="女" :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="手机号:" name="phone">
            <a-input v-model:value="form.phone" autocomplete="off" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入手机号')"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱:" name="email">
            <a-input v-model:value="form.email" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入邮箱')"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="出生年月:" name="birthday">
            <a-date-picker v-model:value="form.birthday" valueFormat="YYYY-MM-DD" type="date" style="width: 100%;"
            format="YYYY-MM-DD" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请选择出生年月')" />
            <!-- <a-input v-model:value="form.birthday" autocomplete="off" :disabled="myOperate === 'check'"></a-input> -->
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="最高学历:" name="education">
            <a-select v-model:value="form.education" :placeholder="handlePlaceholder('请选择最高学历')" :disabled="myOperate === 'check'">
              <a-select-option label="本科以下" :value="1">本科以下</a-select-option>
              <a-select-option label="本科" :value="2">本科</a-select-option>
              <a-select-option label="硕士" :value="3">硕士</a-select-option>
              <a-select-option label="博士" :value="4">博士</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="毕业学校:" name="school">
            <a-input v-model:value="form.school" autocomplete="off" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入毕业学校')"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="院系:" name="faculty">
            <a-input v-model:value="form.faculty" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入院系')"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="工作年限:" name="workYear">
            <a-input v-model:value="form.workYear" autocomplete="off" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入工作年限')"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="最近所在公司:" name="lastCompanyName">
            <a-input v-model:value="form.lastCompanyName" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入最近所在公司')"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="最近所在岗位:" name="job">
            <a-input v-model:value="form.job" autocomplete="off" :disabled="myOperate === 'check'" :placeholder="handlePlaceholder('请输入最近所在岗位')"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="现在所在地" name="currentLocationCodeArr">
            <a-cascader :options="options" v-model:value="form.currentLocationCodeArr" :disabled="myOperate === 'check'" style="width=100%" :placeholder="handlePlaceholder('请选择现在所在地')" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="户口所在地" name="accountLocationCodeArr">
            <a-cascader :options="options" v-model:value="form.accountLocationCodeArr" :disabled="myOperate === 'check'" style="width=100%" :placeholder="handlePlaceholder('请选择户口所在地')" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { addressData } from "@/utils/addressData";
import { save } from "@/api/subject";
import { showMessage } from "@/utils/utils";
import { fetchUserDetailInAct } from "@/api/activity";
export default {
  data() {
    return {
      myOperate: "",
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      options: addressData,
      form: {
        name: "",
        idNumber: "",
        idType: undefined,
        jobNumber: "",
        gender: undefined,
        phone: "",
        email: "",
        birthday: "",
        education: undefined,
        school: "",
        faculty: "",
        workYear: "",
        lastCompanyName: "",
        job: "",
        currentLocationCodeArr: [],
        accountLocationCodeArr: [],
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // idNumber: [{ validator: this.compareToPassport }],
        // phone: [{ validator: this.compareToPhone }],
        // idNumber: [{ required: true, message: "请输入身份证/护照号", trigger: "blur" }, { validator: this.compareToPassport }],
        // gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        // phone: [{ required: true, message: "请输入手机号", trigger: "blur" }, { validator: this.compareToPhone }],
        // email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        // birthday: [{ required: true, message: "请选择出生日期", trigger: "change" }],
        // education: [{ required: true, message: "请选择最高学历", trigger: ["change", "blur"] }],
        // job: [{ required: true, message: "请输入最近所在岗位", trigger: "blur" }],
        // school: [{ required: true, message: "请输入毕业学校", trigger: "blur" }],
        // faculty: [{ required: true, message: "请输入院系", trigger: "blur" }],
        // workYear: [{ required: true, message: "请输入工作年限", trigger: "blur" }],
        // lastCompanyName: [{ required: true, message: "请输入最近所在公司", trigger: "blur" }],
        // currentLocationCodeArr: [{ required: true, message: "请选择所在地", trigger: "change" }],
        // accountLocationCodeArr: [{ required: true, message: "请选择户口所在地", trigger: "change" }],
      }
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    handleSwitchModal: {
      type: Function,
      required: true
    },
    id: {
      type: Number,
    },
    operate: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.myOperate = this.$props.operate
    fetchUserDetailInAct({ userId: this.id }).then(res => {
      if (res.success) {
        Object.keys(this.form).forEach(item => {
          // console.log(item, res.result[item], res.result[item] === null || res.result[item] === '')
          if (res.result[item] === null || res.result[item] === '') {
            this.form[item] = undefined
          } else {
            this.form[item] = res.result[item]
          }
        })
        // console.log(this.form)
      }
    })
  },
  methods: {
    onSubmit() {
      if (this.myOperate === "check") {
        return this.handleSwitchModal({}, false)
      }
      this.$refs.myForm.validateFields().then(
        res => {
          const birthday = this.form.birthday || ''
          save({...this.form, birthday, userId: this.id, activityId: this.$route.params.id}).then(res => {
            if (res.success) {
              this.handleSwitchModal({}, false);
              this.$emit("query");
              showMessage("success", "修改成功");
            } else {
            }
          });
        },
        err => showMessage("error", "表单信息不完整")
      )
    },
    handleSwitchOperate(op) {
      if (op === "check") {
        this.myOperate = "edit"
      } else {
        this.myOperate = "check"
      }
    },
    handlePlaceholder(text) {
      return this.myOperate === 'check' ? '' : text 
    },
  }
};
</script>

<style>
</style>