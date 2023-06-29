<template>
  <div class="table-container">
      <el-table :data="tableData" empty-text="暂无数据" height="100%" header-cell-class-name="table-header" row-class-name="table-row" @selection-change="handleSelectionChange">
          <el-table-column v-if="selection" type="selection" width="55" />
          <el-table-column v-if="sort" type="index" label="序号" width="60" align="left" />

          <el-table-column align="left" :width="column.width" :label="column.label" :key="column.prop" :fixed="column.fixed" v-for="column in columns">
              <template #header="scope">
                  <div class="head-cell">
                      {{ scope.column.label }}
                  </div>
              </template>
              <template v-if="slots[column.prop]" #default="{ row, $index }">
                  <div class="column-cell">
                      <slot :name="column.prop" :scope="{ row, $index }" />
                  </div>
              </template>

              <template v-else #default="{ row }">
                  <div class="column-cell">
                      {{ row[column.prop] || '--' }}
                  </div>
              </template>
          </el-table-column>
      </el-table>
  </div>

  <div class="pagination1" v-if="data?.pager">
      <el-pagination
          background
          :default-page-size="10"
          :total="pages.total"
          :current-page="pages.PageNumber"
          :page-sizes="[5, 10, 20, 30, 50, 100]"
          layout="total, prev, pager, next, sizes"
          @current-change="handleChange"
          @size-change="handleSizeChange"
      />
  </div>
</template>

<script setup lang="ts">
  import { ref, toRaw, useSlots, watch, reactive } from 'vue'

  const slots = useSlots()
  const emits = defineEmits(['change', 'selection'])
  const props = defineProps({
      data: {
          type: Object,
          default: null
      },
      columns: {
          type: [Array as any],
          default: () => []
      },
      sort: {
          type: Boolean,
          default: true
      },
      selection: {
          type: Boolean,
          default: false
      }
  })

  const tableData = ref([])
  const pages = reactive({
      PageNumber: 1,
      inputPageNum: 1,
      total: 0,
      pageTotal: 1
  })
  let PageSize = 10

  watch(
      () => props.data,
      val => {
          val = toRaw(val)
          if (!val || Object.keys(val).length === 0) return

          const pager = val.pager || {}
          const list = val.list || []

          pages.total = pager.Total || 0
          tableData.value = list
          pages.PageNumber = pager.PageNumber || 1
          pages.inputPageNum = pager.PageNumber || 1
          pages.pageTotal = pager.Pages || 1
      },
      {
          deep: true,
          immediate: true
      }
  )

  const handleChange = (e: number) => {
      emits('change', {
          PageNumber: e,
          PageSize
      })
  }

  const handleSizeChange = (e: number) => {
      PageSize = e
      if (pages.PageNumber !== 1) {
          pages.PageNumber = 1
          return
      }
      emits('change', {
          PageNumber: 1,
          PageSize
      })
  }

  const handleConfirm = () => {
      emits('change', {
          PageNumber: pages.inputPageNum,
          PageSize
      })
  }

  const handleSelectionChange = (val: any[]) => {
      emits('selection', val)
  }
</script>

<style scoped lang="scss">
  .table-container {
      max-height: calc(100% - 80px);
      overflow: auto;

      ::v-deep(.table-header) {
          height: 46px;
          background: #f7f8fa !important;
          color: #242b3a;
      }

      ::v-deep(.table-row) {
          height: 46px;
      }

      .head-cell {
          padding-left: 8px;
          position: relative;
          color: #242b3a;

          &:before {
              content: '';
              display: block;
              position: absolute;
              width: 1px;
              height: 20px;
              background: #eaedef;
              left: 0;
          }
      }

      .column-cell {
          padding-left: 8px;
          color: #242b3a;
      }
  }

  .pagination1 {
      height: 50px;
      margin-top: 24px;
      // @include flex($jc: flex-end);

      ::v-deep(.el-button--primary) {
          background-color: #ffffff;
          color: #0057fe;
          border: 1px solid #0057fe;
      }

      ::v-deep(button) {
          background: #ffffff !important;
          border: 1px solid #dbe1e7;
          border-radius: 4px !important;
      }

      ::v-deep(.number) {
          border-radius: 4px !important;
          background: #ffffff !important;
          border: 1px solid #dbe1e7;

          &.is-active {
              color: #0057fe !important;
              border: 1px solid #0057fe;
              font-weight: normal !important;
          }
      }

      ::v-deep(.more) {
          background-color: #ffffff !important;
      }
  }

  .jump {
      font-size: 14px;
      color: #242b3a;
      // @include flex();
      margin-left: 10px;

      ::v-deep(.el-input__inner) {
          text-align: center;
      }
  }

  .table-header {
      height: 46px;
      background: #f7f8fa;
      font-weight: bold;
      color: #242b3a;
  }
</style>
