<template>
    <div :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { onMounted, nextTick, onBeforeUnmount, onUnmounted, ref, PropType, defineExpose } from 'vue'
    import { QuestionTypeAndCountsItem } from './type'

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
            type: Array as PropType<QuestionTypeAndCountsItem[]>,
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
        setCountBarOption(props.optionData)
        myChart.setOption(option.value)
        Resize()
    }
    const option = ref<any>()
    const setCountBarOption = (val: QuestionTypeAndCountsItem[]) => {
        const xAxisData: string[] = val.map((i: QuestionTypeAndCountsItem) => {
            return i.QuestionTypeName ? i.QuestionTypeName : '其他'
        })
        function getRandomColor(seed: number): string {
            const random = (Math.tanh(seed) * 10000) % 1
            const color = `#${Math.floor(random * 0xffffff)
                .toString(16)
                .padStart(6, '0')}`
            return color
        }

        const seriesData: any = val.map((i: QuestionTypeAndCountsItem, index) => {
            const color = getRandomColor(index % 11)
            return {
                value: i.QuestionCount,
                itemStyle: { color: color }
            }
        })
        option.value = {
            grid: {
                left: '3%',
                right: '3%',
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
                type: 'category',
                data: xAxisData,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    //展示角度
                    rotate: -45
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'bar',
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
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
<style scoped lang="scss"></style>
