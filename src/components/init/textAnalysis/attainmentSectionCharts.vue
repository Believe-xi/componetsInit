<template>
    <div class="overallanalysis" :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { onMounted, nextTick, onBeforeUnmount, onUnmounted, ref, PropType, defineExpose } from 'vue'
    import { LiteracyItem } from './type'

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
            type: Array as PropType<LiteracyItem[]>,
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
        setCoreAllPieOption(props.optionData)
        myChart.setOption(option.value)
        Resize()
    }
    const option = ref<any>()
    const setCoreAllPieOption = (val: LiteracyItem[]) => {
        const dataFormater = val.map(i => ({
            value: i.Percent,
            name: i.LiteracyName
        }))
        option.value = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} ({d}%)'
            },
            grid: {
                left: '50%',
                right: '50%',
                bottom: '2%',
                containLabel: true
            },
            series: [
                {
                    name: '核心素养分布',
                    type: 'pie',
                    radius: '75%',
                    center: ['50%', '50%'],
                    roseType: 'area',
                    label: {
                        formatter: '{b} {d}%'
                    },
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: dataFormater
                }
            ]
        }
    }
    defineExpose({
        Resize
    })
</script>
<style scoped lang="scss"></style>
