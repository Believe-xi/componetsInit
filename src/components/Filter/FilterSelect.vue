<template>
    <el-select style="width: 100%;">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { IField, ISelectOption } from "@/types/filter";

const props = defineProps({
    field: {
        type: Object as PropType<IField>,
        required: true
    }
});

const options = ref<ISelectOption[]>([]);

const init = async () => {
    if (props.field.func) {
        const res = await props.field.func();
        options.value = props.field.deal ? props.field.deal(res.result) : [];
    } else {
        options.value = props.field.data || [];
    }
};

init();
</script>
