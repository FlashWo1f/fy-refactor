<template>
  <div class="table-wrapper">
    <a-alert :closable="false" class="margin10" show-icon>
      <template #message>
        <div>
          已选择&nbsp;&nbsp;&nbsp;
          <span style="color: #984CFB;">{{ selectedRowKeys.length }}</span>&nbsp;&nbsp;&nbsp;项
          <a-button type='link' class="clear-btn" @click="$emit('clearSelected')">清空</a-button>
        </div>
      </template>
    </a-alert>
    <slot></slot>
    <!-- <Pagination v-model:tableData='tableData' @query="query" /> -->
  </div>
</template>

<script>
import Pagination from "@/components/FyPagination/pagination.vue";
export default {
  data() {
    return {
    }
  },
  // 禁用 Attribute 继承
  inheritAttrs: false,
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  props: {
    selectedRowKeys: {
      type: Array,
      default: () => ([])
    },
    tableData: {
      type: Object,
      default: () => ({
        list: [],
        pageNo: 1,
        pageSize: 10,
        total: 0
      })
    }
  },
  methods: {
    // query(params) {
    //   this.$emit('query', params)
    // },
  },
  components: {
    Pagination,
  }
}
</script>

<style lang='less'>
.clear-btn {
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1;
  height: 24px;
}
</style>