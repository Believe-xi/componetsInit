<template>
  <div class="text-analysis-dialog">
      <el-drawer class="drawer" :model-value="props.modelValue" title="I'm outer Drawer" size="90%" :before-close="closeDrawer" direction="btt" :show-close="false">
          <template #header>
              <p class="text-header">试卷分析</p>
          </template>
          <!-- <AnalysisChartsVue /> -->
          <img class="drwaer-close" :src="DrawerCloseIcon" alt="" @click="closeDrawer" />
      </el-drawer>
  </div>
</template>

<script lang="ts" setup>
  // import AnalysisChartsVue from './analysisCharts.vue'
  import {defineProps, defineEmits} from 'vue'
  import DrawerCloseIcon from '@/assets/icon_close@2x.png'
  const props = defineProps({
      modelValue: {
          type: Boolean,
          default: false
      }
  })
  const emits = defineEmits(['update:modelValue'])

  const closeDrawer = () => {
      emits('update:modelValue', false)
  }
</script>
<style scoped lang="scss">
  .text-analysis-dialog {
      border-radius: 20%;
      background: #000000;
      :deep(.el-overlay) {
          background-color: rgba($color: #000000, $alpha: 0.7);
      }
      .text-header {
          font-family: HarmonyOS_Sans_SC_Bold;
          color: #242b3a;
          line-height: 24px;
          font-size: 20px;
      }
      :deep(.el-drawer) {
          border-radius: 20px 20px 0 0;
      }
      :deep(.el-drawer__body) {
          padding: 0;
      }
      .drwaer-close {
          position: fixed;
          top: 5%;
          right: 24px;
          height: 36px;
          transform: translateY(-18px);
          // background: #000000;
          // opacity: 0.7;
      }
  }
</style>
