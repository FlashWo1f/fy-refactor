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
    <a-form
      ref="ruleForm"
      :model="formValue"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item ref="name" label="姓名" name="name">
            <a-input v-model:value="formValue.name" placeholder="请输入姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="证件号" style="margin: 0">
            <a-row>
              <a-col :span="9" style="margin-right: 10px">
                <a-select v-model:value="formValue.idType" placeholder="证件类型">
                  <a-select-option :value="1">身份证</a-select-option>
                  <a-select-option :value="2">护照</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="14">
                <a-form-item name="idNumber">
                  <a-input v-model:value="formValue.idNumber" placeholder="请输入证件号" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工号" name="jobNumber">
            <a-input v-model:value="formValue.jobNumber" placeholder="请输入工号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="gender">
            <a-select v-model:value="formValue.gender" placeholder="请选择性别">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!-- 手机号 -->
          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="formValue.phone" placeholder="请输入手机号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!-- 邮箱 -->
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="formValue.email" placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="出生日期" name="birthday">
            <a-date-picker
              v-model:value="formValue.birthday"
              type="date"
              placeholder="请选择出生日期"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="最高学历" name="education">
            <a-select v-model:value="formValue.education" placeholder="请选择最高学历">
              <a-select-option :value="1">本科以下</a-select-option>
              <a-select-option :value="2">本科</a-select-option>
              <a-select-option :value="3">硕士</a-select-option>
              <a-select-option :value="4">博士</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="毕业学校" name="school">
            <a-input v-model:value="formValue.school" placeholder="请输入毕业学校" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="院系" name="faculty">
            <a-input v-model:value="formValue.faculty" placeholder="请输入院系" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工作年限" name="workYear">
            <a-input v-model:value="formValue.workYear" placeholder="请输入工作年限" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="最近所在公司" name="lastCompanyName">
            <a-input
              v-model:value="formValue.lastCompanyName"
              placeholder="请输入最近所在公司"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="最近所在岗位" name="job">
            <a-input v-model:value="formValue.job" placeholder="请输入最近所在岗位" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="现在所在地" name="currentLocationCodeArr">
            <a-cascader
              :options="options"
              v-model:value="formValue.currentLocationCodeArr"
              style="width=100%"
              placeholder="请输入现在所在地"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="户口所在地" name="accountLocationCodeArr">
            <a-cascader
              :options="options"
              v-model:value="formValue.accountLocationCodeArr"
              style="width=100%"
              placeholder="请输入户口所在地"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import moment from "moment"
import subject from "@/api/subject";
import { addressData } from "@/utils/addressData";
import { showMessage } from '@/utils/utils'
export default {
  data() {
    this.rules = {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    }
    this.options = addressData
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      submitLoading: false,
      formValue: {
        activityId: "",
        name: "", // 姓名
        idType: 1, // 身份证护照类型
        idNumber: "", // 身份证护照证件号
        jobNumber: "", // 工号
        gender: undefined, // 性别
        phone: "", // 手机号
        email: "", // 邮箱
        birthday: null, // 出生年月
        education: undefined, // 最高学历
        school: "", // 毕业学校
        faculty: "", // 院系
        workYear: "", // 工作年限
        lastCompanyName: "", // 最近所在公司
        job: "", // 最近所在岗位
        currentLocationCodeArr: undefined, // 现在所在地
        accountLocationCodeArr: undefined, // 户口所在地
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.fetchData()
      } else {
        this.clearFormValue()
      }
    }
  },
  props: {
    visible: {
      tpye: Boolean,
    },
    curId: {
      type: Number,
    },
    activityId: {
      type: Number,
    }
  },
  methods: {
    fetchData() {
      subject.getDetail({ userId: this.curId }).then(res => {
        const { result = {}, success } = res
        if (success) {
          Reflect.ownKeys(this.formValue).forEach(v => {
            this.formValue[v] = result[v]
          })
        }
      })
    },
    handleSubmit() {
      this.$refs.ruleForm.validate().then(
        res => {
          this.submitLoading = true
          if (this.formValue.birthday instanceof Object) {
            const date = moment(this.formValue.birthday, this.dateFormat);
            this.formValue.birthday = date;
          }
          subject.save({
            ...this.formValue,
            userId: this.curId,
            activityId: this.activityId,
          }).then(res => {
            if (res.success) {
              showMessage('success', "修改个人信息成功");
              this.$emit('update:visible', false)
              this.$emit("query")
            }
          }).finally(() => this.submitLoading = false)
        },
        err => {
          showMessage('error', '表单填写有误')
        }
      )
    },
    clearFormValue() {
      this.formValue = {
        activityId: "",
        name: "", 
        idType: 1, 
        idNumber: "", 
        jobNumber: "", 
        gender: undefined, 
        phone: "", 
        email: "", 
        birthday: null, 
        education: undefined, 
        school: "", 
        faculty: "", 
        workYear: "", 
        lastCompanyName: "", 
        job: "", 
        currentLocationCodeArr: undefined, 
        accountLocationCodeArr: undefined, 
      }
    },
  }
}
</script>
