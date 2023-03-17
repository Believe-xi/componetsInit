<template>
    <div class="charts-list">
        <div class="charts-item" v-for="(item, index) in chartsList" :key="index">
            <div class="charts-header">
                <span class="charts-name">{{ item.name }}</span>
                <el-button v-if="item.name === '核心素养分布'" type="primary" :disabled="!props.detail.coreLiteracyCount?.length" link @click="levelRangeClick">查看详情</el-button>
            </div>
            <div class="charts-body">
                <component ref="chartsComponet" class="charts" :id="item.id" :is="item.componet" :optionData="item.data" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, defineProps, onMounted, onUnmounted, markRaw } from 'vue'
    import lodash from 'lodash'
    import overallAnalysisVue from './overallAnalysis.vue'
    import questionNumChartsVue from './questionNumCharts.vue'
    import difficultAnalysisChartVue from './difficultAnalysisChart.vue'
    import knowledgeAnalysisChartsVue from './knowledgeAnalysisCharts.vue'
    import attainmentSectionChartsVue from './attainmentSectionCharts.vue'
    import levelRangeChartsVue from './levelRangeCharts.vue'

    const props = defineProps({
        detail: {
            type: Object,
            default() {
                return {}
            }
        }
    })
    const emits = defineEmits(['levelRangeClick'])
    const chartsList = ref([
        {
            name: '总体分析',
            id: 'overallAnalysisVue',
            componet: markRaw(overallAnalysisVue),
            data: props.detail.allAnalysisOption
        },
        {
            name: '题量分析',
            id: 'questionNumChartsVue',
            componet: markRaw(questionNumChartsVue),
            data: props.detail.questionTypeAndCounts
        },
        {
            name: '难易分析',
            id: 'difficultAnalysisChartVue',
            componet: markRaw(difficultAnalysisChartVue),
            data: props.detail.difficultyTypeAndCounts
        },
        {
            name: '知识点分析',
            id: 'knowledgeAnalysisChartsVue',
            componet: markRaw(knowledgeAnalysisChartsVue),
            data: props.detail.konwledgeAndQuestionCounts
        },
        {
            name: '核心素养分布',
            id: 'attainmentSectionChartsVue',
            componet: markRaw(attainmentSectionChartsVue),
            data: props.detail.coreLiteracyCount
        },
        {
            name: '学科能力层级分布',
            id: 'levelRangeChartsVue',
            componet: markRaw(levelRangeChartsVue),
            data: props.detail.abilityLevelCount
        }
    ])
    console.log(props.detail)
    const levelRangeClick = () => {
        emits('levelRangeClick', true)
    }

    const chartsComponet = ref()

    const resize = () => {
        chartsComponet.value.forEach((item: any) => item.Resize && item.Resize())
    }
    const debounceResize = lodash.debounce(resize, 300)
    window.addEventListener('resize', debounceResize)

    onMounted(() => {
        resize
    })

    onUnmounted(() => {
        window.removeEventListener('resize', debounceResize)
    })
</script>
<style scoped lang="scss">
    .charts-list {
        // grid-template-columns: repeat(3, 1fr);
        display: grid;
        grid-template-columns: repeat(3, 30.33%);
        grid-template-rows: repeat(2, 50%);
        justify-content: space-around;
        background-color: #f7f6f9;
        .charts-item {
            border-radius: 4px;
            background: #ffffff;
            margin: 10px 0;
            min-height: 300px;
            .charts-header {
                margin: 12px 12px;
                padding-top: 10px;
                vertical-align: middle;
                display: flex;
                justify-content: space-between;
                .charts-name {
                    font-size: 16px;
                    line-height: 20px;
                    font-family: HarmonyOS_Sans_SC_Bold;
                    font-weight: 600;
                    &::before {
                        display: inline-block;
                        content: '';
                        width: 3px;
                        height: 16px;
                        margin: 0 10px;
                        background: #0057fe;
                        vertical-align: middle;
                    }
                }
            }
            .charts-body {
                // display: flex;
                // justify-content: center;
                // flex: 1;
                // align-items: center;
            }
            .charts {
                height: 400px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
