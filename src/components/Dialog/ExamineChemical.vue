<template>
    <el-dialog
        :model-value="isExamine"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="80%"
        style="min-width: 900px;min-height: 80vh;"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="chemicals__title">危化品{{ title }}审批</div>
        </template>

        <div class="check__header">
            <div v-for="item in filter" :key="item.Id">
                <span>{{ item.Name }}：</span>
                <span v-if="item.type === 'date'">
                    <span v-if="item.value" style="color: #242B3A;">
                        {{ dayjs(item.value).format("YYYY-MM-DD") }}
                    </span>
                    <span v-else style="color: #242B3A;">--</span>
                </span>
                <span v-else>{{ item.value }}</span>
            </div>
        </div>

        <div class="chemicals__title">危化品列表</div>

        <LyxTable :columns="listColumns" :tableData="tableData">
            <template #assetsName="scope">
                <span class="lyx-asset__name" @click="handleName(scope.row)">
                    {{ scope.row.assetsName }}
                </span>
            </template>
            <template #assetsExptime="scope">
                <span v-if="scope.row.assetsExptime">
                    {{ dayjs(scope.row.assetsExptime).format("YYYY-MM-DD") }}
                </span>
                <span v-else>--</span>
            </template>
            <template #warehouseName="scope">
                <span>{{ scope.row.warehouseName }}</span>
            </template>
            <template #assetsImg="scope">
                <el-button type="primary" link @click="handleView(scope.row.assetsImg)">查看</el-button>
            </template>
            <template #option="scope">
                <el-button type="primary" link @click="download(scope.row)">打印标签</el-button>
            </template>
        </LyxTable>

        <template #footer>
            <div class="check__footer" v-if="rowData.status === 2">
                <div @click="handleSubmit(0)">驳回</div>
                <div @click="handleSubmit(1)">通过</div>
            </div>
        </template>
    </el-dialog>

    <ViewTag v-model:is-show-tag="isShowTag" :tagInfo="tagInfo" />
    <ExaminedReject :visible="examinedRejectVisible" @confirm="onConfirm" />
    <ChemicalDetail v-model:is-show-detail="isShowDetail" :rowId="rowId" />
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import dayjs from "dayjs";
import LyxTable from "@/components/LyxTable/index.vue";
import ViewTag from "@/components/Dialog/ViewTag.vue";
import ExaminedReject from "@/components/Dialog/ExaminedReject.vue";
import { listColumns, IFilterItem } from "@/views/Chemicals/Storage/props";
import { ElMessage } from "element-plus";
import ChemicalDetail from "@/views/Chemicals/List/components/chemicalDetail.vue";

defineProps({
    isExamine: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    },
    filter: {
        type: Array as PropType<IFilterItem[]>,
        default: () => []
    },
    rowData: {
        type: Object,
        default: () => {}
    }
});

const emit = defineEmits(["update:isExamine"]);

const handleClose = () => {
    emit("update:isExamine", false);
};

// 打印标签
const isShowTag = ref(false);
const tagInfo = ref([]);
const download = (row) => {
    isShowTag.value = true;
    console.log(row);
};

// 查看
const photoVisible = ref(false);
const imgUrlList = ref<string[]>([]);
const handleView = (row) => {
    if (row) {
        const list = row.split(",");
        imgUrlList.value = list?.map(i => i.split("|")[0]);
        photoVisible.value = true;
    } else {
        ElMessage.warning("暂无图片");
    }
};

const isShowDetail = ref(false);
const rowId = ref("");
const handleName = (row) => {
    isShowDetail.value = true;
    rowId.value = row.id;
};

const examinedRejectVisible = ref(false);
const handleSubmit = (val) => {
    examinedRejectVisible.value = val === 0;
};

const onConfirm = (flag, val) => {
    examinedRejectVisible.value = false;
    if (flag) {
        console.log(val);
    }
};

const tableData = ref([{
    id: "11",
    assetsCode: "111",
    assetsName: "111",
    brand: "111",
    assetsModel: "111",
    assetsExptime: "111",
    assetsImg: "",
    warehouseName: "111"
}]);

</script>

<style lang="scss" scoped>
.lyx-asset__name {
    cursor: pointer;
    color: var(--el-color-primary);
}
.chemicals__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
    margin-bottom: 16px;
}

.check__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    div {
        width: 80px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #FFFFFF;
    }

    div:nth-of-type(1) {
        background: #F64949;
    }

    div:nth-of-type(2) {
        background: #2FD7A2;
        margin-left: 12px;
    }
}

.check__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    position: relative;

    >div {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A;
        margin: 0 60px 20px 0;

        span:nth-of-type(1) {
            color: #90949E;
        }
    }

    .check-status {
        position: absolute;
        top: 0;
        right: 0;
        width: 81px;
        height: 71px;
    }
}

</style>
