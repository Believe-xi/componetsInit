<template>
    <div :id="Id" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch, toRefs, onBeforeUnmount, onMounted } from 'vue'
import jsMind from '/public/jsmind/js/jsmind.js'
import lodash from 'lodash'

export default defineComponent({
    props: {
        Id: {
            type: String,
            default: 'jsmind_container'
        },
        data: {
            type: Object,
            default: () => {
                return {}
            }
        },
        init: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const JM = ref()
        const mind = ref({
            meta: {
                name: '思维导图',
                author: 'hizzgdev@163.com',
                version: '0.2'
            },
            format: 'node_tree',
            data: props.data
        })
        const bgMapColor = ['#FF6464', '#F55CD7', '#FF8E2A', '#FFC92A', '#D4DB00', '#82E14D', '#2FD7A2', '#5CD2DE', '#45C4FF', '#458DFF', '#6067FF', '#9160FF', '#73C3C5', '#FF659D', '#A9B7DB']
        let bgMapIndex = 0
        const selectTypes = ['1', '2', '3', '4'] // 选中types Array
        let activeColor = bgMapColor[bgMapIndex % 16]

        // 循环树
        const loopTreeData = (list: any, callback: any) => {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;(function doOneFloor(list) {
                if (Array.isArray(list)) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i]
                        item.Level == 2 && (activeColor = bgMapColor[bgMapIndex++ % 16])
                        callback(item, i)
                        if (item.children && item.children.length > 0) {
                            doOneFloor(item.children)
                        }
                    }
                }
            })(list)
        }
        // 设置颜色
        const setColor = () => {
            JM.value.set_node_color(mind.value.data.id, 'rgb(13, 11, 34)', '#fff')
            loopTreeData(mind.value.data.children, (item: any) => {
                if (selectTypes.length) {
                    if (item.IsLight) {
                        JM.value.set_node_color(item.id, activeColor, '#fff')
                    }
                }
            })
        }

        const init = () => {
            JM.value.expand_all()
            bgMapIndex = 0
            setColor()
        }

        const initShow = (options: any) => {
                nextTick(() => {
                    if (!JM.value) JM.value = new jsMind(options)
                    JM.value.show(mind.value)
                    computedHeight()
                    init()
                })
            }

        // 设置宽高和canvas一样
        const computedHeight = () => {
            const jsmindEle = document.getElementsByClassName('jsmind-inner')
            const jsmindeleId = document.getElementById(props.Id)
            const findeItem = Array.prototype.find.call(jsmindEle, (item: HTMLCollection) => {
                return Array.prototype.includes.call(jsmindeleId?.children, item)
            })
            if (!findeItem) return
            findeItem.style.height = findeItem.firstChild.offsetHeight + 'px'
            findeItem.style.width = findeItem.firstChild.offsetWidth + 'px'
        }
        const initShowDebounce = lodash.debounce(initShow, 1000)

        onMounted(() => {
            window.addEventListener('resize', initShowDebounce)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', initShowDebounce)
        })
        
        const options = ref({
                container: props.Id, // [必选] 容器的ID
                editable: false, // [可选] 是否启用编辑
                view: {
                    engine: 'svg', // 思维导图各节点之间线条的绘制引擎
                    hmargin: 40, // 思维导图距容器外框的最小水平距离
                    vmargin: 50, // 思维导图距容器外框的最小垂直距离
                    line_width: 2, // 思维导图线条的粗细
                    line_color: '#C9D2DB' // 思维导图线条的颜色
                },
                layout: {
                    hspace: 35, // 节点之间的水平间距
                    vspace: 10, // 节点之间的垂直间距
                    pspace: 0 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
                },
                shortcut: {
                    enable: false
                }
            })

        watch(
            () => props.data,
            () => {
                console.log('watch')
                initShowDebounce(options.value)
            },
            {
                immediate: true
            }
        )

        watch(
                () => props.init,
                () => {
                    props.init && initShow(options.value)
                }
            )

        return {
            ...toRefs(props)
        }
    }
})
</script>

<style lang="scss" scoped></style>
