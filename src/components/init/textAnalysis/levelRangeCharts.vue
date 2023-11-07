<template>
    <div :id="id"></div>
</template>

<script lang="ts" setup>
    import * as echarts from 'echarts'
    import { reactive, onMounted, nextTick, onBeforeUnmount, onUnmounted, PropType, defineExpose } from 'vue'
    import { AbilityLevelItem } from './type'

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
            type: Array as PropType<AbilityLevelItem[]>,
            required: true,
            default() {
                return []
            }
        }
    })
    let myChart: any = null
    onMounted(() => {
        const chartDom = document.getElementById(props.id)
        myChart = echarts.init(chartDom as HTMLElement, undefined, props.size)
        nextTick(() => {
            init()
            Resize()
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
        function getLevelOption() {
            return [
                {
                    itemStyle: {
                        // borderColor: '#fff',
                        borderWidth: 0,
                        gapWidth: 3
                    },
                    upperLabel: {
                        show: false
                    }
                },
                {
                    colorSaturation: [0.3, 0.7],
                    itemStyle: {
                        borderWidth: 5,
                        gapWidth: 1,
                        borderColorSaturation: 0.6
                    }
                },
                {
                    // colorSaturation: [0.3, 0.7],
                    itemStyle: {
                        borderWidth: 1,
                        gapWidth: 1,
                        borderColorSaturation: 0.6
                    }
                }
            ]
        }
        const option = reactive({
            tooltip: {
                formatter: function (info: any) {
                    var treePathInfo = info.treePathInfo
                    var treePath = []
                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name)
                    }
                    return ['<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>'].join('')
                }
            },
            series: [
                {
                    name: '学科能力层级分布',
                    type: 'treemap',
                    visibleMin: 300,
                    label: {
                        show: true,
                        formatter: '{b} {c}%'
                    },
                    upperLabel: {
                        show: true,
                        height: 30,
                        color: '#fff',
                        backgroundColor: 'inherit'
                    },
                    itemStyle: {
                        borderColor: '#fff'
                    },
                    levels: getLevelOption(),
                    data: handleOptionsData(props.optionData)
                }
            ]
        })
        myChart.setOption(option)
    }

    const handleOptionsData = (option: AbilityLevelItem[]): any => {
        return option?.map((item: AbilityLevelItem) => ({
            value: Math.floor(item.Percent * 100),
            name: item.AbilityName,
            children: item.AbilityChartDtos?.length && handleOptionsData(item.AbilityChartDtos)
        }))
    }

    defineExpose({
        Resize
    })
</script>
<style scoped lang="scss"></style>
