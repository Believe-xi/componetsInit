<template>
  <el-table :data="tableData" style="width: 100%" :header-cell-style="handerMethod" :span-method="objectSpanMethod">
      <el-table-column prop="core" label="核心素养" />
      <el-table-column prop="core2" label="核心素养1" />
      <el-table-column prop="core3" label="核心素养2" />
      <el-table-column prop="level" label="能力层级" />
      <el-table-column prop="question" label="题型" />
      <el-table-column prop="questionNum" label="题目数量" />
      <el-table-column prop="textScore" label="卷面分数" />
      <el-table-column prop="questionIndex" label="题号" />
      <el-table-column label="难度模型">
          <el-table-column prop="name1" label="背景因素D" />
          <el-table-column prop="name2" label="知识含量E" />
          <el-table-column prop="name3" label="运算水平F" />
          <el-table-column prop="name4" label="思维方向G" />
          <el-table-column prop="name5" label="认知水平H" />
          <el-table-column prop="name6" label="推理能力I " />
          <el-table-column prop="difficult" label="难度值  " />
      </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  interface objectKey<U> {
      [key: string]: U
  }
  const tableData = ref<objectKey<string>[]>([
      {
          core: '抽象能力',
          core2: '量感',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '1'
      },
      {
          core: '抽象能力',
          core2: '量感',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '1'
      },
      {
          core: '抽象能力',
          core2: '量感',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '1'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      },
      {
          core: '几何直观',
          core2: '量感1',
          core3: '度量单位的感知与理解',
          level: '说明论证',
          question: '判断',
          questionNum: '1',
          textScore: '90',
          questionIndex: '10086',
          name1: '1',
          name2: '2',
          name3: '1',
          name4: '1',
          name5: '1',
          name6: '1',
          difficult: '1.7',
          id: '2'
      }
  ])

  const handerMethod = ({ row, column, rowIndex, columnIndex }) => {
      console.log(row, column, rowIndex, columnIndex)
      if (row[0].level == 1) {
          row[0].colSpan = 3
          row[1].colSpan = 0
          row[2].colSpan = 0
          if (columnIndex === 1) {
              return { display: 'none' }
          }
          if (columnIndex === 2) {
              return { display: 'none' }
          }
      }
  }

  const mergeArr = ['core', 'core2', 'core3', 'level', 'question', 'questionNum', 'textScore']
  const mergeObject = reactive<objectKey<number[]>>({})

  const getMergeObject = () => {
      mergeArr.forEach((key, index1) => {
          let count = 0
          mergeObject[key] = []
          tableData.value.forEach((item, index) => {
              // 本列上下行内容相同
              // debugger
              console.log(count, 'count')
              if (index === 0) {
                  mergeObject[key].push(1)
              } else {
                  if (item[key] === tableData.value[index - 1][key]) {
                      // if (index1 == 0) {
                      //     // 当前项 加1 合并行置为0
                      //     mergeObject[key][count] += 1
                      //     mergeObject[key].push(0)
                      // } else {
                      // 前一列上下行合并 两项上一个key是否相等
                      if (item[mergeArr[index1 - 1]] == tableData.value[index - 1][mergeArr[index1 - 1]] && item.id == tableData.value[index - 1].id) {
                          mergeObject[key][count] += 1
                          mergeObject[key].push(0)
                      } else {
                          count = index
                          mergeObject[key].push(1)
                      }
                      // }
                  } else {
                      count = index
                      mergeObject[key].push(1)
                  }
              }
          })
      })
  }
  const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (~mergeArr.indexOf(column.property)) {
          if (mergeObject[column.property][rowIndex]) {
              return {
                  rowspan: mergeObject[column.property][rowIndex],
                  colspan: 1
              }
          } else {
              return {
                  rowspan: 0,
                  colspan: 0
              }
          }
      } else {
          return {
              rowspan: 1,
              colspan: 1
          }
      }
  }
  onMounted(() => {
      getMergeObject()
      console.log(mergeObject, 'v')
  })
</script>
<style scoped></style>
