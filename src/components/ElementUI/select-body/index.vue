<template>
  <el-option-group
		class="select-body"
    v-for="group in [{ label: '员工' }]"
    :key="group.label"
    :label="group.label"
  >
    <el-input v-model="mainValue" placeholder="请输入内容" />
    <div class="breadcrumb">
      <breadNavVue :breadcrumb-list="breadcrumbList" @bread-click="breadClick"/>
    </div>
    <el-option-group
      v-for="dep in mainEmployeeList[mainLevel].deptList"
      :key="dep.name"
    >
      <div class="group">
				{{ dep.name + `(${mainEmployeeList[mainLevel].employeeList.length})` }}
				<el-button class="next-group" link type="primary" @click="nextClick(dep)">下级</el-button>
			</div>
      <el-option
        v-for="employee in mainEmployeeList[mainLevel].employeeList"
        :key="employee.employeeName"
        :label="employee.employeeName "
        :value="employee.employeeName"
      >
				<userCardVue :user-info="employee"/>
			</el-option>
    </el-option-group>
  </el-option-group>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs } from 'vue'
import breadNavVue from './breadNav.vue';
import userCardVue from './userCard.vue';
const props = defineProps({
  mainEmployeeList: {
    type: Object,
    default() {
      return [
        {
          deptList: [
            {
              deptId: 18,
              pid: 0,
              deptType: 1,
              name: '全公司',
              code: '1',
              allNum: 2,
              hasChildren: 1,
              currentNum: 1
            }
          ],
          employeeList: [
            {
              employeeId: 8,
              employeeName: '杨阳',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 9,
              employeeName: '张展',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 10,
              employeeName: '张三',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 11,
              employeeName: '王离',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 13,
              employeeName: 'admin',
              deptName: null,
              post: '标准岗位',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 14,
              employeeName: '吉杰',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
            {
              employeeId: 15,
              employeeName: '吉杰1111',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            }
          ]
        },
				{
          deptList: [
            {
              deptId: 18,
              pid: 0,
              deptType: 1,
              name: '测试',
              code: '1',
              allNum: 2,
              hasChildren: 1,
              currentNum: 1
            },
						{
              deptId: 18,
              pid: 0,
              deptType: 1,
              name: '测试2',
              code: '1',
              allNum: 2,
              hasChildren: 1,
              currentNum: 1
            }
          ],
          employeeList: [
            {
              employeeId: 8,
              employeeName: '杨阳',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
          ]
        },
				{
          deptList: [
            {
              deptId: 18,
              pid: 0,
              deptType: 1,
              name: '测试1',
              code: '1',
              allNum: 2,
              hasChildren: 1,
              currentNum: 1
            },
						{
              deptId: 18,
              pid: 0,
              deptType: 1,
              name: '测试2',
              code: '1',
              allNum: 2,
              hasChildren: 1,
              currentNum: 1
            }
          ],
          employeeList: [
            {
              employeeId: 8,
              employeeName: '杨阳1',
              deptName: null,
              post: '',
              mobile: null,
              email: null,
              sex: null,
              status: null,
              isDel: null
            },
          ]
        }
      ]
    }
  }
})

const mainValue = ref('')
const mainLevel = ref(0)
// const mainEmployeeList = ref([
//   {
//     deptList: [
//       {
//         deptId: 18,
//         pid: 0,
//         deptType: 1,
//         name: '全公司',
//         code: '1',
//         allNum: 2,
//         hasChildren: 1,
//         currentNum: 1
//       }
//     ],
//     employeeList: [
//       {
//         employeeId: 8,
//         employeeName: '杨阳',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 9,
//         employeeName: '张展',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 10,
//         employeeName: '张三',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 11,
//         employeeName: '王离',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 13,
//         employeeName: 'admin',
//         deptName: null,
//         post: '标准岗位',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 14,
//         employeeName: '吉杰',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       },
//       {
//         employeeId: 15,
//         employeeName: '吉杰1111',
//         deptName: null,
//         post: '',
//         mobile: null,
//         email: null,
//         sex: null,
//         status: null,
//         isDel: null
//       }
//     ]
//   }
// ])
const breadcrumbList = ref([
  {
    label: '全部',
    value: ''
  }
])

const { mainEmployeeList } = toRefs(props)

const nextClick = (dep: any) => {
	const obj = {
		label: dep.name,
		value: dep.deptId
	}
	breadcrumbList.value.push(obj)
	mainLevel.value += 1
}

const breadClick = (value: string, index: number) => {
	mainLevel.value = index
	breadcrumbList.value.splice(index + 1)
}
</script>
<style scoped lang="scss">
.select-body {
	padding: 0 10px;
	.group {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
