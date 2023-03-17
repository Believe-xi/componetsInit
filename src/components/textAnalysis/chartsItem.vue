<template>
    <div class="charts-item">
        <div class="charts-header">
            {{ props.title }}
        </div>
        <div class="charts-body">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        title: {
            type: String,
            default: ''
        }
    })
</script>
<style scoped lang="scss">
    .charts-item {
        border-radius: 4px;
        background: #ffffff;
        .charts-header {
            font-size: 16px;
            font-family: HarmonyOS_Sans_SC_Bold;
            &::before {
                display: inline-block;
                content: '';
                width: 3px;
                height: 16px;
                background: #0057fe;
            }
        }
    }
</style>
