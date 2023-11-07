<template>
    <div :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { onMounted, nextTick, onBeforeUnmount, onUnmounted, ref, PropType, defineExpose } from 'vue'
    import { KonwledgeAndQuestionCountsItem } from './type'

    const props = defineProps({
        size: {
            type: Object,
            default() {
                return {
                    width: 448,
                    height: 280
                }
            }
        },
        id: {
            type: String,
            default: 'questionnumCharts'
        },
        optionData: {
            type: Array as PropType<KonwledgeAndQuestionCountsItem[]>,
            required: true,
            default() {
                return []
            }
        }
    })
    let myChart: any = null
    onMounted(() => {
        const chartDom = document.getElementById(props.id)
        myChart = echarts.init(chartDom as HTMLElement)
        nextTick(() => {
            init()
        })
    })
    const Resize = () => {
        myChart.resize()
    }
    onBeforeUnmount(() => {
        if (myChart) myChart.dispose()
    })
    onUnmounted(() => {
        myChart = null
    })
    const init = () => {
        setKonwledgeBarOption(props.optionData.filter((i: KonwledgeAndQuestionCountsItem) => i.QuestionCount !== null))
        myChart.setOption(option.value)
        Resize()
    }

    const option = ref<any>()
    const setKonwledgeBarOption = (val: KonwledgeAndQuestionCountsItem[]) => {
        option.value = {
            grid: {
                left: '3%',
                right: '5%',
                bottom: '2%',
                // top: '5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                appendToBody: true,
                formatter: '{b} : {c}'
            },
            legend: {
                show: false,
                orient: 'vertical',
                left: 'left'
                // data: []
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: val.map(i => i.KonwledgeName),
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#EFF2F5'
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    color: '#EFF2F5',
                    data: val.map(i => i.QuestionCount),
                    emphasis: {
                        itemStyle: {
                            color: '#458DFF'
                        }
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: 'black',
                                    fontSize: '12',
                                    fontFamily: 'HarmonyOS_Sans_SC'
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
    defineExpose({
        Resize
    })
</script>
<style scoped lang="scss">
    #overallanalysis {
        width: 100%;
        height: 100%;
    }
</style>
