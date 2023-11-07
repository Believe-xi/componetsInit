<template>
    <div :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { onMounted, nextTick, onBeforeUnmount, onUnmounted, PropType, ref, defineExpose } from 'vue'
    import { DifficultyTypeAndCountsItem } from './type'
    import { hardLevelOptions } from './type'

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
            default: 'overallanalysis'
        },
        optionData: {
            type: Array as PropType<DifficultyTypeAndCountsItem[]>,
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
        setHardLevelPieOption(props.optionData.filter((i: DifficultyTypeAndCountsItem) => i.Proportion !== null))
        myChart.setOption(option.value)
        Resize()
    }

    const option = ref<any>()
    const setHardLevelPieOption = (val: { DifficultyType: string; Proportion: number }[]) => {
        const seriesData: { name: string; value: number }[] = []
        val.forEach(i => {
            hardLevelOptions.forEach(j => {
                if (i.DifficultyType === j.Id) {
                    const Proportion = i.Proportion.toFixed(0)
                    seriesData.push({ name: `${j.Name}${Proportion}%`, value: Number(Proportion) })
                }
            })
        })
        console.log('setHardLevelPieOption', seriesData, val)
        option.value = {
            tooltip: {
                trigger: 'item',
                appendToBody: true,
                formatter: '{b}'
                // formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                show: false,
                orient: 'vertical',
                left: 'left'
                // data: []
            },
            series: [
                {
                    name: '难易分析',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    data: seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
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
