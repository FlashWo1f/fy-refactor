<template>
  <a-modal
    title="链接"
    :visible="visible"
    :maskClosable="false"
    @cancel="$emit('update:visible', false)"
  >
    <a-input-search
      placeholder="input search text"
      enter-button="复制链接"
      size="large"
      :value="link"
      @search="copyText"
    />
    <div id="qrCode" style="margin-top: 30px;">
      <img :src="qrCodeLink" alt="加载失败">
    </div>
    <template #footer class="dialog-footer">
      <a-button @click="downloadIamge(qrCodeLink, actName)">下载二维码</a-button>
      <a-button type="primary" @click="$emit('update:visible', false)">确 定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { showMessage } from "@/utils/utils";
export default {
  data() {
    return {
      link: "https://www.baidu.com"
    };
  },
  props: ["visible", "actLink", "qrCodeLink", "actName"],
  watch: {
    visible(val) {
      if (val) {
        this.link = this.$props.actLink
      } else {
        setTimeout(() => {
          this.$emit("update:qrCodeLink", '')
        }, 300)
      }
    }
  },
  methods: {
    downloadIamge(imgsrc, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous"); // 解决跨域 Canvas 污染问题
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); // 得到图片的base64编码数据
        let a = document.createElement("a");
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = `qrCode-${name}.png` || "photo"; // 设置图片名称
        a.href = url;
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    copyText() {
      const el = document.createElement("textarea");
      el.value = this.link;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      showMessage("success", "成功复制到剪切板");
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
  }
};
</script>

<style lang="less" scoped>
#qrCode {
  width: 200px;
  height: 200px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
