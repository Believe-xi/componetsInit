<template>
  <el-breadcrumb class="bread" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(bread, index) in breadcrumbList" :key="bread.value" @click="breadClick(bread.value, index)">
      <span class="bread-span" :class="{ 'active': active == bread.value}">{{ bread.label }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, PropType, ref, watch, defineEmits } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { tagEmits } from 'element-plus';

const emits = defineEmits(['breadClick'])
const props = defineProps({
  breadcrumbList: {
    type: Array as PropType<{ label: string; value: string }[]>,
    default() {
      return [
        {
          label: '全部',
          value: ''
        }
      ]
    }
  }
})

const { breadcrumbList } = toRefs(props)

const active = ref('')

const breadClick = (value: string, index: number) => {
  active.value = value
  emits('breadClick', value, index)
}

watch(() => breadcrumbList, () => {
  active.value = breadcrumbList.value[breadcrumbList.value.length - 1].value
})
</script>
<style scoped lang="scss">
.bread {
  padding: 15px 0px;
  color: #eee;
  .bread-span {
    color: #333;
    cursor: pointer;
  }
  .active {
    color: #666;
    cursor: default;
  }
}
</style>
