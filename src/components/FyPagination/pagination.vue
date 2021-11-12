<template>
  <a-pagination
    style="text-align: right; margin-top: 20px;"
    show-quick-jumper
    showSizeChanger
    :total="tableData.total"
    :showTotal='(total, range) => `共${total}条`'
    :current="tableData.pageNo"
    :pageSize="tableData.pageSize"
    :pageSizeOptions="['10', '20', '50', '100']"
    @change="onChange"
    @showSizeChange="onSizeChange"
  />
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      required: true,
      default: function() {
        return {
          pageNo: 1,
          pageSize: 10,
          list: [],
          total: 0
        };
      }
    },
  },
  methods: {
    onChange(pageNo, pageSize) {
      this.$emit('query', { pageNo, pageSize: pageSize || 10 } )
      console.log('pageNo, pageSize', pageNo, pageSize)
    },
    onSizeChange(current, size) {
      this.$emit('query', { pageSize: size, pageNo: current || 1} )
      console.log('current, size', current, size)
    }
  }
};
</script>

<style>
</style>