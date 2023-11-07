<template>
    <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
            <el-col v-bind="field.props || span" v-for="field in fields" :key="field.key">
                <el-form-item :label="field.name">
                    <component
                        :is="FormComponents[field.component]"
                        v-model="form[field.key]"
                        :placeholder="field.placeholder || ''"
                        :field="field"
                    />
                </el-form-item>
            </el-col>

            <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
                <el-form-item class="lyx-filter-buttons">
                    <el-button plain @click="reset">重置</el-button>
                    <el-button type="primary" plain @click="search">查询</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup>
import { PropType, onMounted, ref } from "vue";
import { IField, IFormState } from "@/types/filter";
import FilterSelect from "./FilterSelect.vue";
import DateRange from "./DateRange.vue";
import FilterSelectTree from "./FilterSelectTree.vue";
import { ElInput } from "element-plus";
import { deepClone } from "@/utils";

const emit = defineEmits(["search"]);

const props = defineProps({
    fields: {
        type: Object as PropType<IField[]>,
        required: true
    },

    formState: {
        type: Object as PropType<IFormState>,
        required: true
    }
});

const span = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4
};

const form = ref({});
const logInitForm = ref({});
onMounted(() => {
    logInitForm.value = deepClone(props.formState);
    form.value = deepClone(props.formState);
});

const FormComponents = {
    input: ElInput,
    select: FilterSelect,
    dateRange: DateRange,
    selectTree: FilterSelectTree
};

const reset = () => {
    form.value = deepClone(logInitForm.value);
    emit("search", form.value);
};

const search = () => {
    emit("search", form.value);
};
</script>

<style lang="scss" scoped>
.lyx-filter-buttons {
    :deep(.el-form-item__content) {
        flex-wrap: nowrap;
        margin-left: 20px !important;
    }
}
</style>
