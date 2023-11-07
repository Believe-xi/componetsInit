<template>
    <div class="lyx-table__container">
        <el-table
            class="lyx-table-custom"
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                v-for="column in columns"
                :key="column.prop"
                v-bind="column"
            >
                <template v-if="column.custom" #default="scope">
                    <slot :name="column.prop" :row="scope.row" :index="scope.$index" />
                </template>
            </el-table-column>
        </el-table>

        <div class="lyx-pagination">
            <el-pagination
                v-if="showPagination"
                v-model:page-size="pageSize"
                v-model::current-page="pageCurrent"
                background
                layout="total, prev, pager, next, sizes, jumper"
                :total="pagination?.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, computed, onMounted, ref, watch } from "vue";
import { ITableColumn, IPagination } from "@/types/table";

const emit = defineEmits(["change", "selection"]);

const props = defineProps({
    tableData: {
        type: Array as PropType<unknown[]>,
        required: true
    },

    columns: {
        type: Array as PropType<ITableColumn[]>,
        requried: true
    },

    pagination: {
        type: Object as PropType<IPagination>
    }
});

const showPagination = computed(() => {
    return !!props.pagination;
});

const pageSize = ref(10);
const pageCurrent = ref(1);

onMounted(() => {
    pageSize.value = props.pagination ? props.pagination.size : 10;
    pageCurrent.value = props.pagination ? props.pagination.current : 1;
});

watch(() => props.pagination, () => {
    pageCurrent.value = props.pagination ? props.pagination.current : 1;
    pageSize.value = props.pagination ? props.pagination.size : 10;
}, {
    deep: true
});

const handleSizeChange = (val: number) => {
    emit("change", {
        ...props.pagination,
        size: val
    });
};
const handleCurrentChange = (val: number) => {
    emit("change", {
        ...props.pagination,
        current: val
    });
};
const handleSelectionChange = (val: any[]) => {
    emit("selection", val);
};
</script>

<style lang="scss" scoped>
.lyx-table__container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.lyx-table-custom {
    :deep(.el-table__header-wrapper) {
        --el-table-tr-bg-color: #f7f8fa;
        --el-table-header-bg-color: #f7f8fa;
        --el-table-header-text-color: #242b3a;
        th {
            .cell {
                line-height: 30px;
                height: 30px;
                position: relative;
                &:after {
                    content: "";
                    display: block;
                    height: 20px;
                    border-right: 1px solid #eaedef;
                    position: absolute;
                    right: 1px;
                    top: 5px;
                }
            }
            &:last-child {
                .cell:after {
                    display: none;
                }
            }
        }
    }

    :deep(.el-table__body-wrapper) {
        .cell {
            line-height: 32px;
        }
    }
}

.lyx-pagination {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    :deep(.el-pagination) {
        --el-pagination-button-bg-color: #fff;
        .el-pager li {
            border: 1px solid #DBE1E7;
            border-radius: 4px;
            &.is-active {
                background-color: #fff;
                color: var(--el-color-primary);
                border-color: var(--el-color-primary);
            }
        }
        .btn-next, .btn-prev {
            border: 1px solid #DBE1E7;
            border-radius: 4px;
        }
    }
}
</style>
