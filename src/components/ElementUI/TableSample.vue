<template>
	<div class="collect-management">
		<div class="search-header">
			<SearchForm />
			<el-button type="primary">新增采集点</el-button>
		</div>

		<div>
			<collectTable :columns="column" :data="tableData">
        <template #CollectionPointStatus="{ scope }">
          <div>
            <el-switch 
              :model-value="scope.row.CollectionPointStatus"
              :active-value="1"
              :inactive-value="0"
              @change="(event: any) => handleChange(event, scope.row, 'CollectionPointStatus')"/>
          </div>
        </template>
        <template #action>
          <div>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
          </div>
        </template>
      </collectTable>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchForm from '../components/searchForm.vue';
import collectTable from './components/collectTable.vue';
import { column } from '../config/props';

const tableData = ref({
	list: [
		{
			SubjectId: 'ut nostrud et consectetur',
			CollectionPointId: 'proident',
			CollectionPointName: '在解状给速',
			CollectionPointCreateTime: '1996-06-06 08:02:29',
			SchoolPhase: 'culpa',
			CollectionPointStatus: 0,
			CollectionPointSort: 12,
		},
		{
			CollectionPointSort: 21,
			SchoolPhase: null,
			CollectionPointId: 'nostrud exercitation',
			CollectionPointStatus: 0,
			CollectionPointName: '新月况',
			CollectionPointCreateTime: '2006-08-22 01:31:43',
			SubjectId: 'aliquip sed',
		},
		{
			SchoolPhase: null,
			CollectionPointId: 'minim quis nostrud aliqua',
			SubjectId: null,
			CollectionPointStatus: 0,
			CollectionPointCreateTime: '2020-05-20 10:27:39',
			CollectionPointSort: 13,
			CollectionPointName: '方少合外明美',
		},
	],
	pager: {
		PageSize: 88,
		Total: 8,
		Pages: 44,
		IsLastPage: false,
		PageNumber: 63,
		IsFirstPage: false,
	},
});

const handleChange = (e: any, row: any ,key: any) => {
  console.log(row, 'row', e, key)
  if (!row) return
  row[key] = e
}
</script>
<style scoped lang="scss">
.collect-management {
	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
