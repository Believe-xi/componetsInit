<template>
    <el-cascader :options="options" :show-all-levels="false" :props="elProps" style="width: 100%" clearable />
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

const elProps = ref({
    children: "",
    label: "",
    value: "id",
    checkStrictly: true,
    emitPath: false
});

if (props.field) {
    if (props.field.key === "consumablesTypeId") {
        elProps.value.children = "consumablesList";
        elProps.value.label = "consumablesTypeName";
    } else if (props.field.key === "deptName") {
        elProps.value.children = "childList";
        elProps.value.label = "name";
    } else {
        elProps.value.children = "childList";
        elProps.value.label = "assetsTypeName";
    }
}

const options = ref<ISelectOption[]>([]);

const init = async () => {
    if (props.field.func) {
        const res = await props.field.func();
        options.value = props.field.deal ? props.field.deal(res.result) : [];
    } else if (props.field.IFunc) {
        const res = await props.field.IFunc();
        options.value = res;
    } else {
        options.value = props.field.data || [];
    }
};

init();
</script>
