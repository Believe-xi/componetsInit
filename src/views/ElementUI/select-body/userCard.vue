<template>
  <div class="user-card">
    <img src="@/assets/images/avatar01.jpg" alt="">
    <div class="user-info">
      <span class="user-name">{{ userInfo.employeeName }}</span>
      <span class="user-point">{{ userInfo.position || '暂无岗位' }}</span>
    </div>
</div>
</template>
  
<script lang="ts" setup>
import { defineProps, toRefs, PropType, ref } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object as PropType<{ employeeName: string; position: string }>,
    default() {
      return {}
    }
  }
})
</script>
<style scoped lang="scss">
.user-card {
  display: flex;
  align-items: center;
  height: 34px;
  > img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
  .user-info {
    height: 34px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 12px;
    line-height: initial;
  }
}
</style>
