<template>
    <div class="level-range-dialog">
        <el-drawer class="drawer" :model-value="props.modelValue" title="I'm outer Drawer" size="90%" :before-close="closeDrawer" direction="btt" :show-close="false">
            <template #header>
                <p class="range-header">核心素养分布详情</p>
            </template>

            <div class="level-range-nav">
                <div class="nav">
                    <menuNavVue @nav-click="navClick"></menuNavVue>
                    <!-- <el-button class="export-table" type="primary" @click="handleExcel">
                        <img class="export-prex" src="@/assets/icon_daochu.svg" alt="" />
                        导出
                    </el-button> -->
                </div>
            </div>
            <img v-if="props.modelValue" class="drwaer-close" :src="DrawerCloseIcon" alt="" @click="closeDrawer" />
            <div class="mind-body" v-show="active == '0'">
                <template v-for="(item, index) in data.children" :key="index">
                    <Mind :init="active == '0'" :Id="`literacyDetails${index}`" :data="item" class="mind-item" />
                </template>
            </div>
            <levelRangeTableVue v-show="active == '1'" :table-data="detailTableData" :defficult="defficultData" :self="props.self" :maxLen="maxLen" />
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch, onMounted } from 'vue'
    import api from '@/api/api'
    import menuNavVue from './components/menuNav.vue'
    import DrawerCloseIcon from '@/assets/levelRange/icon_close@2x.png'
    import Mind from './components/mind.vue'
    import levelRangeTableVue from './components/levelRangeTable.vue'
    import { LiteracyDescripDetailDto, IDNameDTO, PortraitPointTreeOutDto, portraitPointDetailDtoN, PortraitPointDetailItemDtos } from './type'
    
    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false
        },
        paperId: {
            type: String,
            defaul: ''
        },
        self: {
            type: Boolean,
            default: false
        }
    })
    const emits = defineEmits(['update:modelValue'])

    const detailData = ref<LiteracyDescripDetailDto>()
    const detailTableData = ref<PortraitPointDetailItemDtos[]>([])
    const maxLen = ref(0)
    const active = ref('0')
    const navClick = (value: string) => {
        active.value = value
    }

    const data = ref({
        id: 'root',
        topic: '数学关键能力',
        children: []
    })

    const initMergeArr = ['targetPointName', 'AbilityLevelName', 'QuestionTypeName', 'QuestionNum', 'Score']

    const getDetail = async () => {
        // const id = '7F09DB089150BA76EB0F68081634B128'
        let res = await api.GetLiteracyDetailV230309(props.paperId)

        if (res.resultCode !== 200) return
        detailData.value = res.result as LiteracyDescripDetailDto
        handleTableData(detailData.value)
        const arr = []
        for (let i = 0; i < maxLen.value; i++) {
            arr.push(i)
        }
        const mergeArr = arr.map((item, index) => `levelPointName${index + 1}`).concat(initMergeArr)
        detailTableData.value = multiSort(
            detailTableData.value,
            mergeArr.map(i => {
                return {
                    key: i,
                    direction: 'asc'
                }
            })
        )
        console.log(detailTableData.value, 'sortedPeople')
        // detailData.value.PortraitPointTreeOutDto.sort((a,b) => a.Value - b.Value)
        data.value.children = handleXminData(detailData.value.PortraitPointTreeOutDto)
    }

    const closeDrawer = () => {
        emits('update:modelValue', false)
    }
    const defficultData = ref<IDNameDTO[]>()
    const handleTableData = (data: LiteracyDescripDetailDto) => {
        let temp = data.PortraitPointDetailDtoNew
        defficultData.value = temp.Difficulties
        let max = 0
        temp.PortraitPointDetailItemDtos.forEach(item => {
            item.TargetAndPoints.sort((a, b) => a.Sort - b.Sort)
            item.TargetAndPoints[item.TargetAndPoints.length - 1]
            item.TargetAndPoints.forEach((point, index) => {
                max = Math.max(max, point.Sort)
                if (point.Type === 2) {
                    item.targetPointName = point.TargetPointName
                    item.targetPointId = point.TargetPointId
                    return
                }
                item['levelPointName' + index] = point.TargetPointName
                item['levelPointId' + index] = point.TargetPointId
            })
        })
        detailTableData.value = temp.PortraitPointDetailItemDtos
        maxLen.value = max
    }

    const handleXminData = (treeData: PortraitPointTreeOutDto[]): any => {
        if (!treeData?.length) return []

        return treeData.map((item, index) => {
            let topicCount = item.Value.concat(' ', item.IsLight ? Math.floor(item.Percent * 100) + '%' : '')
            const temp: any = {
                id: item.Id,
                topic: topicCount,
                Percent: item.Percent,
                IsLight: item.IsLight,
                Level: item.Level,
                type: (item.Level - 1).toString(),
                children: handleXminData(item.Children)
            }
            if (item.Level === 2) {
                temp.direction = index / 2 == 0 ? 'right' : 'left'
                temp.expanded = true
                temp.type = '4'
            }

            return temp
        })
    }

    // 排序函数
    function multiSort(arr: any, criteria: any) {
        return arr.sort((a: any, b: any) => {
            for (let i = 0; i < criteria.length; i++) {
                const criterion = criteria[i]
                if (a[criterion.key] < b[criterion.key]) {
                    return criterion.direction === 'asc' ? -1 : 1
                }
                if (a[criterion.key] > b[criterion.key]) {
                    return criterion.direction === 'asc' ? 1 : -1
                }
            }
            return 0
        })
    }

    onMounted(() => {
        getDetail()
    })
    watch(
        () => props.modelValue,
        () => {
            if (props.modelValue) {
                getDetail()
            }
        }
    )
</script>
<style scoped lang="scss">
    .level-range-dialog {
        border-radius: 20%;
        background: #000000;

        :deep(.el-overlay) {
            background-color: rgba($color: #000000, $alpha: 0.7);
        }
        :deep(.el-drawer__body) {
            display: flex;
            flex-direction: column;
        }
        .range-header {
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
            // z-index: 2022;
            // background: #000000;
            // opacity: 0.7;
        }

        .level-range-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .nav {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 166px;
                height: 36px;
                margin-bottom: 10px;
            }
            .export-table {
                position: absolute;
                right: 20px;
                top: 0;
                .export-prex {
                    margin-right: 5px;
                }
            }
        }
        .mind-body {
            display: flex;
            flex-direction: column;
            height: 100%;
            .mind-item {
                flex: 1;
                display: flex;
                align-items: center;
                margin: 0 auto;
                :deep(.jsmind-inner) {
                    overflow: inherit;
                    width: 0;
                }
            }
        }
    }
</style>
