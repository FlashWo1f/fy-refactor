import { EditStar } from "@/api/activity.js";
import FyForm from "@/components/FyForm/FyForm.vue"
import { mapGetters } from "vuex";
import { showMessage } from "@/utils/utils";

export default {
  created() {
    const {
      params: { id },
    } = this.$router.currentRoute.value;
    this.activityId = id;
  },
  computed: {
    ...mapGetters(["token", "userId"]),
  },
  methods: {
    handleSwitchStar(allFields) {
      EditStar({
        userId: allFields.userId,
        starFlag: allFields.starFlag === 1 ? 2 : 1,
      }).then((res) => {
        if (res.success) {
          if (allFields.starFlag === 1) showMessage("success", "取消标星");
          else showMessage("success", "标星成功");
          this.$emit('query')
        }
      });
    },
    onSelectChange(selectedRowKeys, selectedRow) {
      this.selectedId = selectedRowKeys
      this.selectedItem = selectedRow
    },
  },
  components: {
    FyForm,
  }
}