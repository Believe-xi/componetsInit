<template>
    <div class="overallanalysis" :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { onMounted, nextTick, ref, PropType, defineExpose, onBeforeUnmount, onUnmounted, } from 'vue'

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
            type: Array as PropType<any>,
            required: true,
            default() {
                return []
            }
        }
    })
    let myChart: any = null
    const option = ref()
    onMounted(() => {
        const chartDom = document.getElementById(props.id)
        myChart = echarts.init(chartDom as HTMLElement)
        nextTick(() => {
            init()
        })
    })

    onBeforeUnmount(() => {
        if (myChart) myChart.dispose()
    })

    onUnmounted(() => {
        myChart = null
    })
    
    const Resize = () => {
        myChart.resize()
    }
    const init = () => {
        setAllPieOption(props.optionData.filter((i: { name: string; value: number }) => i.value))
        myChart.setOption(option.value)
        Resize()
    }
    const setAllPieOption = (val: { name: string; value: number }[]) => {
        option.value = {
            tooltip: {
                trigger: 'item',
                appendToBody: true,
                formatter: '{b} : {d}%'
                // formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                show: false,
                orient: 'vertical',
                left: 'left',
                data: ['主观题', '客观题']
            },
            series: [
                {
                    name: '总体分析',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    data: val,
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
