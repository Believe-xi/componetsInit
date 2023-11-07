<template>
    <div class="menu-nav">
        <div v-for="item in props.navInfo" :key="item.value" class="nav-item" :class="active == item.value ? 'active' : ''" @click="activeClick(item.value)">{{ item.name }}</div>
    </div>
</template>

<script lang="ts" setup>
    import { PropType, ref } from 'vue'
    const emits = defineEmits(['navClick'])
    const props = defineProps({
        navInfo: {
            type: Array as PropType<{ name: string; value: string }[]>,
            default() {
                return [
                    {
                        name: '概览',
                        value: '0'
                    },
                    {
                        name: '明细',
                        value: '1'
                    }
                ]
            }
        }
    })
    const active = ref('0')

    const activeClick = (value: string) => {
        active.value = value
        emits('navClick', value)
    }
</script>
<style scoped lang="scss">
    .menu-nav {
        width: 1000%;
        height: 100%;
        background: #eff2f5;
        border-radius: 4px;
        display: flex;
        padding: 3px;
        .nav-item {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        & > .active {
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            font-weight: bold;
            font-size: 14px;
            color: #242b3a;
        }
    }
</style>
