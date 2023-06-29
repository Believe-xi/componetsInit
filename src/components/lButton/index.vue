<template>
	<el-button class="btn" size="small" @click="$emit('click')">
		<slot name="default">更多</slot>
		<img :src="Icon3" alt="" />
	</el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon3 from '../../../../assets/images/teach_studio/arrow_more@2x.png';
export default defineComponent({
  name: 'LButton',
	emits:['click'],
  setup(){
    return {
      Icon3
    }
  }
})
</script>
<style scoped lang="scss">
.btn {
	min-height: 0px;
	padding: 0 7px;
	height: 30px;
	line-height: 30px;
	border-radius: 15px;
	img {
		width: 6px;
		margin-left: 6px;
	}
}
</style>
