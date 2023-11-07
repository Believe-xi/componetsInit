<template>
  <div class="message-box">
    <el-dialog
      :model-value="dialogVisible"
      width="30%"
      :before-close="cancelStatus">
      <div class="message-body">
        <img
          class="icon-img"
          src="@/assets/images/Warning@2x.png"
          alt="" />
        <span class=""><slot></slot></span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="cancleShow"
            @click="cancelStatus"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="confirmStatus">
            <slot name="confirm">确定</slot>
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
export default defineComponent({
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    cancleShow: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:dialogVisible', 'cancel', 'confirm'],
  setup(props, { emit }) {
    const cancelStatus = () => {
      emit('cancel')
    }
    const confirmStatus = () => {
      emit('confirm')
    }
    return {
      ...toRefs(props),
      cancelStatus,
      confirmStatus
    }
  }
})
</script>
<style scoped lang="scss">
.message-box {
  :deep(.el-dialog__body) {
    padding: 10px 20px;
    line-height: 32px;
  }
  .message-body {
    display: flex;
    font-family: HarmonyOS_Sans_SC_Bold;
    font-weight: 600;
  }
  :deep(.el-dialog) {
    border-radius: 8px;
  }
  .icon-img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 16px;
  }
}
</style>
