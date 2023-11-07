<template>
    <div class="suject-table">
        <el-table align="center" v-if="isShow" :data="tableData" :header-cell-style="handerMethod" :span-method="objectSpanMethod" :row-style="tableRowClassName">
            <el-table-column v-for="item in props.maxLen" :key="item" :prop="'levelPointName' + item" label="核心素养" />
            <el-table-column prop="targetPointName" label="核心素养" />
            <el-table-column prop="AbilityLevelName" label="能力层级" />
            <el-table-column prop="QuestionTypeName" label="题型" />
            <el-table-column prop="QuestionNum" label="题目数量">
                <template #default="{ row }">
                    {{ row.num }}
                </template>
            </el-table-column>
            <el-table-column v-if="props.self" prop="Score" label="卷面分数" />
            <el-table-column prop="QuestionSort" label="题号" />
            <el-table-column label="难度模型">
                <template #default>
                    <el-table-column v-for="item in props.defficult" :key="item?.Id" prop="DifficultyFactoryName" :label="item?.Name">
                        <template #default="{ row }">
                            <!-- {{ row.QuestionDifficulties[index]?.DifficultyValue }} -->
                            {{ defficultMethods(row.QuestionDifficulties, item?.Id) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="DifficultyTotalValue" label="难度值" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { ref, defineProps, PropType, toRefs, watch } from 'vue'
    import { IDNameDTO, QuestionDifficulty, PortraitPointDetailItemDtos } from '../type'

    interface objectKey<U> {
        [key: string]: U
    }

    const props = defineProps({
        tableData: {
            type: Array as PropType<PortraitPointDetailItemDtos[]>,
            default() {
                return []
            }
        },
        defficult: {
            type: Array as PropType<IDNameDTO[]>,
            default() {
                return []
            }
        },
        self: {
            type: Boolean,
            default: false
        },
        maxLen: {
            type: Number,
            default: 0
        }
    })

    const { tableData } = toRefs(props)
    const isShow = ref(false)
    const handerMethod = ({ row, columnIndex }: any) => {
        // console.log(row, column, rowIndex, columnIndex)
        if (row[0].level == 1) {
            row[0].colSpan = props.maxLen + 1
            row.forEach((item, index) => {
                if (index !== 0 && index < props.maxLen + 1) {
                    item.colSpan = 0
                }
            })
            if (columnIndex !== 0 && columnIndex <= props.maxLen) {
                return { display: 'none' }
            }
        }
        return {
            background: '#89B3FF',
            color: '#FFFFFF',
            'font-family': 'HarmonyOS_Sans_SC_Bold',
            'border-color': '#c9dcff',
            height: '20px'
        }
    }
    const initMergeArr = ['targetPointName', 'AbilityLevelName', 'QuestionTypeName', 'QuestionNum', 'Score']
    const initMergeArr1 = ['targetPointId', 'AbilityLevelId', 'QuestionTypeId', 'QuestionNum', 'Score']
    let mergeArr: string[] = [].concat(initMergeArr)
    let mergeArr1: string[] = [].concat(initMergeArr1)
    const mergeObject = ref<objectKey<number[]>>({})

    const getMergeObject = () => {
        let arr = []
        for (let i = 0; i < props.maxLen; i++) {
            arr.push(i)
        }
        mergeArr = arr.map((item, index) => `levelPointName${index + 1}`).concat(initMergeArr)
        mergeArr1 = arr.map((item, index) => `levelPointId${index + 1}`).concat(initMergeArr1)
        console.log(mergeArr1.toString(), 'mergeArr1')
        mergeObject.value = {}
        mergeArr.forEach((key, index1) => {
            let count = 0
            mergeObject.value[key] = []
            tableData.value.forEach((item, index) => {
                // 本列上下行内容相同
                // debugger
                // console.log(count, 'count')
                item.num = item.num || 1
                if (index === 0) {
                    mergeObject.value[key].push(1)
                } else {
                    if (item[key] === tableData.value[index - 1][key]) {
                        let isSame = true
                        // if (item[key] == 'faefawfa') debugger
                        mergeArr.every((me, meIndex) => {
                            if (meIndex === index1) {
                                if (key == 'QuestionNum') {
                                    const preItem = tableData.value[index - 1]
                                    preItem.numNo == undefined && (preItem.numNo = index - 1)
                                    console.log(preItem.numNo, 'preItem.numNo')

                                    item.numNo = preItem.numNo
                                    tableData.value[item.numNo].num += 1
                                }
                                return !(isSame = true)
                            }
                            const Ikey = mergeArr1[meIndex]
                            if (item[Ikey] == tableData.value[index - 1][Ikey]) {
                                return true
                            }
                            return (isSame = false)
                        })

                        // 前一列上下行合并 两项上一个key是否相等
                        if (isSame) {
                            mergeObject.value[key][count] += 1
                            mergeObject.value[key].push(0)
                        } else {
                            count = index
                            mergeObject.value[key].push(1)
                        }
                    } else {
                        count = index
                        mergeObject.value[key].push(1)
                    }
                }
            })
        })
        console.log(
            tableData.value.map(item => item),
            'item'
        )
        isShow.value = true
    }
    const objectSpanMethod = ({ column, rowIndex }: any) => {
        if (~mergeArr.indexOf(column.property)) {
            if (mergeObject.value[column.property][rowIndex]) {
                return {
                    rowspan: mergeObject.value[column.property][rowIndex],
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

    const defficultMethods = (queDefficult: QuestionDifficulty[], id: string) => {
        return queDefficult.find(item => item.DifficultyFactoryId === id)?.DifficultyValue
    }
    let activeName = ''
    const colorArr = ['#F9FBFF', '#FFF6F6', '#FFFBEF', '#EFFCF8']
    let index = 0
    const tableRowClassName = ({ row }: { row: PortraitPointDetailItemDtos }) => {
        if (activeName != row.SecondPointName) {
            activeName = row.SecondPointName
            index++
        }
        return {
            'background-color': colorArr[index % 4],
            'font-family': 'HarmonyOS_Sans_SC',
            color: '#242B3A',
            'border-color': '#c9dcff'
        }
    }

    watch(
        () => props.tableData,
        () => {
            if (props.tableData.length) {
                getMergeObject()
            }
        },
        {
            immediate: true
        }
    )
</script>
<style scoped lang="scss">
    .suject-table {
        margin: 0 20px;
        width: auto;
        text-align: center;
        display: flex;
        justify-content: center;
        padding-bottom: 120px;
        .el-table th.table-top {
            height: 36px;
            background: #89b3ff;
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #ffffff;
        }
        .table-contert {
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #242b3a;
            background: #f9fbff;

            th {
                height: 40px;
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #242b3a;
            }
        }
        :deep(.el-table th, .el-table td) {
            text-align: center;
        }

        :deep(.el-table td .cell) {
            text-align: center;
        }
    }
</style>
