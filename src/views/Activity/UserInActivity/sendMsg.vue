<template>
  <div>
    <a-modal 
      width="1100px" 
      v-model:visible="$store.state.common.isSendModal" 
      :title="$store.state.common.sendTitle" 
      @opened="setEditor"
    >
      <div class="sendModal">
        <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item ref="name" label="邮件主题" name="subject">
            <a-input v-model:value="form.subject" placeholder="请输入邮件主题" />
          </a-form-item>
          <a-form-item ref="name" label="可选变量" style="line-height:40px">
            <div class="variable">
              <p v-for="item in variableList" :key="item.id" @click="labelAppend(item)">{{ item.name }}</p>
            </div>
          </a-form-item>
          <a-form-item ref="name" label="邮件正文" name="emailTemplate">
            <div class="editor-bar" ref="editorBar">
              <div class="file-icon">
                <img src="https://static.upupfarm.com/editor/file_icon.png" alt="" @click="$refs.inputFile.click()" />
                <input ref="inputFile" hidden type="file" multiple accept=".docx,.pptx,.xlsx,.pdf,.zip,.rar" @click="$event.target.value = null" @change="uploadFile" />
                <!-- @change="uploadFile"  -->
              </div>
            </div>
            <div ref="editors" style="text-align:left"></div>
            <div class="file-list" v-if="form.attachments.length">
              <FileItem class="file-item" v-for="(item, index) in form.attachments" :key="index" :file="item" @delFile="delFile(index)"></FileItem>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="$store.commit('SET_SEND_MODAL', false)">取 消</a-button>
          <a-button type="primary" @click="handleOk">确 定</a-button>
        </span>
      </template>
    </a-modal>
    <!-- <div ref="editors" style="text-align:left"></div> -->
  </div>
</template>
<script>
import E from "wangeditor";
import email from "@/api/email";
import FileItem from "@/components/FileItem.vue";
import tab_mixin from "./tab_mixin";
import { uploadImage } from "@/api/activity";
import axios from "axios";
import { mapGetters } from "vuex";
import { showMessage } from '@/utils/utils'
export default {
  mixin: [tab_mixin],
  data() {
    return {
      visible: false,
      userIds: [],
      form: {
        subject: "【扶摇职上】UpUp游戏化测评测试邀请",
        emailTemplate: "", // 富文本框内容
        activityId: this.$route.params.id,
        type: null,
        userIds: [],
        attachments: [],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      // 存一份 name是下载的时候显示的名字 size一样 isUploaded是不是上传完
      curFile: {},
      // form.attachments: [
      //   { name: "1.pdf", size: 12, url: `demo.pdf` },
      //   { name: "1.docx", size: 12, url: `doc.docx` },
      //   { name: "1.pptx", size: 12, url: `ppt.pptx` },
      // ],
      editor: undefined,
      variableList: [
        {
          id: 0,
          name: "测试者姓名",
        },
        {
          id: 1,
          name: "活动名称",
        },
        {
          id: 2,
          name: "活动日期",
        },
      ],
      rules: {
        subject: [{ required: true, message: "请输入邮件主题", trigger: "blur" }],
        emailTemplate: [{ required: true, trigger: "blur" }],
      },
    };
  },
  components: {
    FileItem,
  },
  props: ["ids"],
  watch: {
    '$store.state.common.isSendModal': function (val) {
      if (val) {
        this.$nextTick(() => {
          this.setEditor()
        })
      }
    },
    // '$store.state.common.sendTitle': function(val) {
    //   val == "发送通知" ? (this.form.subject = "【扶摇职上】UpUp游戏化测评测试邀请") : (this.form.subject = "【扶摇职上】UpUp游戏化测评测试提醒");
    // },
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["token", "userId"]),
  },
  methods: {
    setEditor() {
      if (this.editor) {
        this.getData();
        return;
      }
      this.editor = new E(this.$refs.editorBar, this.$refs.editors);
      this.editor.customConfig.onchange = (html) => {
        // console.log(html);
        this.form.emailTemplate = html;
      };
      this._setUploadLocalImg();
      this.editor.create();
      this.getData();
    },
    async getData() {
      this.form.emailTemplate = "";
      this.form.subject = "";
      const res = await email.downTemplate(this.$route.params.id);
      if (res && res.result) {
        // this.form.emailTemplate = res.result.template;
        this.form.emailTemplate = res.result.template;
        this.form.subject = res.result.title;
        this.editor.txt.html(res.result.template);
      }
    },
    async uploadFile(e) {
      console.log(e);
      let files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        await this._handleSingleFile(files[i]);
      }
    },
    async _handleSingleFile(file) {
      this.curFile = {
        name: file.name,
        size: file.size,
        isUploaded: false,
        url: "",
      };
      this.form.attachments.push(this.curFile);
      // 上传,上传成功之后设置状态和下载地址
      let res = await this._uploadSingleFile(file);
      this.curFile.isUploaded = true;
      console.log(res);
      this.curFile.url = res;
    },
    // 删除文件的时候
    delFile(index) {
      this.form.attachments.splice(index, 1);
    },
    // 设置上传本地图片
    _setUploadLocalImg() {
      this.editor.customConfig.customUploadImg = async (files, insert) => {
        // files 是 input 中选中的文件列表，遍历上传
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          // 上传服务器拿到图片链接,这里_uploadSingleFile就是上传图片接口，
          let imgUrl = await this._uploadSingleFile(file);
          // 获取图片 url 后，插入到编辑器
          insert(imgUrl);
        }
      };
    },
    // 上传
    async _uploadSingleFile(file) {
      let options = {
        url: `${process.env.VUE_APP_FREFIX_URL}/admin/file/upload`,
        method: "POST",
        data: { file },
        headers: { "x-access-token": this.token, "x-user-id": this.userId, "x-user-type": 2 },
        // 上传文件需要参数转化成formData形式
        transformRequest: [
          function(data) {
            let formData = new FormData();
            for (const key in data) {
              const value = data[key];
              formData.append(key, value);
            }
            return formData;
          },
        ],
      };
      let res = (await axios(options)).data;
      if (res.result && res.result.url) {
        return res.result.url;
      } else {
        return showMessage('error', "上传失败");
      }
    },
    // 添加节点
    labelAppend(item) {
      this.editor.cmd.do(
        "insertHTML",
        `<span style="border-radius:20px;
            padding: 0 30px;
            display:inline-block;
            height:30px;
            line-height:30px;
            text-align:center;
            color:#fff;
            background:#1890ff">${item.name}</span><span>&nbsp;</span><img src="">`
      );
    },
    handleOk(e) {
      this.$refs.ruleForm.validate().then(
        res => {
          this.submitData()
        },
        err => {
          console.log("error submit!!", err)
        }
      )
    },
    async submitData() {
      this.form.userIds = this.$store.state.common.selectedArr;
      if (this.$store.state.common.sendTitle == "发送通知") {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
      // 以免在 selectedNum 无缘无故 有个 1 项
      this.$emit("update:ids", []);
      this.$emit("clearSelected");
      console.log(this.form);
      const res = await email.sendEmail(this.form);
      if (res.success) {
        showMessage('success', "发送邮件成功");
        this.$store.commit('SET_SEND_MODAL', false)
      }
    },
  },
};
</script>
<style lang="less" scoped>
.sendModal {
  // height: 70vh;
  overflow: auto;
  .variable {
    display: flex;
    color: #fff;
    > p {
      margin-right: 10px;
      border-radius: 20px;
      width: 120px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #1890ff;
    }
  }
  /* 编辑区 */
  .editor-bar {
    position: relative;
    border: 1px solid #eee;
  }
  /deep/.w-e-text {
    padding: 0 10px;
    overflow-y: auto;
    border: 1px solid #eee;
    max-height: 660px;
  }
  /* 附件图标 */
  .file-icon {
    position: absolute;
    top: 16px;
    width: 16px;
    height: 16px;
    z-index: 3;
    cursor: pointer;
    right: 3px;
  }
  /* 附件图标图片 */
  .file-icon img {
    width: 100%;
    height: 100%;
    display: block;
  }
  /* 文件区 */
  .file-list {
    padding: 10px 0 0 10px;
    display: flex;
    border: 1px solid #eee;
    flex-wrap: wrap;
    border-top: 0;
  }
  .file-item {
    margin: 0 10px 10px 0;
    width: 220px;
  }
  .file-item:last-child {
    margin-right: 0;
  }
}
</style>
