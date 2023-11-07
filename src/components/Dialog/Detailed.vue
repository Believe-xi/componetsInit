<template>
    <el-dialog
        :model-value="visible"
        :close-on-click-modal="false"
        class="lyx-dialog lyx-dialog-height"
        width="70%"
        style="min-width: 900px;min-height: 80vh;"
        :before-close="handleClose"
    >
        <template #header>
            <div class="title">{{ title }}</div>
        </template>
        <LyxTable :tableData="tableData" :columns="columns">
            <template #assetsExptime="scope">
               {{ scope.row.assetsExptime?scope.row.assetsExptime.split("T")[0]:"--" }}
            </template>
            <template #consumablesExptime="scope">
               {{ scope.row.consumablesExptime?scope.row.consumablesExptime.split(" ")[0]:"--" }}
            </template>
            <template #assetsImg="scope">
                <el-button type="primary" link @click="detailedPreview(scope.row)">
                    查看
                </el-button>
            </template>
            <template #consumablesImg="scope">
                <el-button type="primary" link @click="detailedPreview(scope.row)">
                    查看
                </el-button>
            </template>
        </LyxTable>
    </el-dialog>
    <PhotoPreview v-model:visible="photoVisible" :urlList="imgUrlList" />
</template>

<script lang="ts" setup>
import { PropType, watch, ref } from "vue";
import { ElMessage } from "element-plus";
import LyxTable from "@/components/LyxTable/index.vue";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: "资产清单明细"
    },
    columns: {
        type: Array as PropType<any>,
        default: () => []
    },
    data: {
        type: Array as PropType<any>,
        default: () => []
    }
});
const emits = defineEmits(["update:visible"]);
const tableData = ref([]);
const photoVisible = ref(false);
const imgUrlList = ref<string[]>([]);
const detailedPreview = (row) => {
    if (row.consumablesImg) {
        const list = row.consumablesImg.split(",");
        imgUrlList.value = list?.map(i => i.split("|")[0]);
        photoVisible.value = true;
    } else if (row.assetsImg) {
        const list = row.assetsImg.split(",");
        imgUrlList.value = list?.map(i => i.split("|")[0]);
        photoVisible.value = true;
    } else {
        ElMessage.warning("暂无照片");
    }
};
const handleClose = () => {
    emits("update:visible", false);
};
watch(
    () => props.data,
    e => {
        tableData.value = e;
    }, { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242b3a;
    font-weight: bold;
}
.info-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    font-family: HarmonyOS_Sans_SC;
    line-height: 24px;
    margin-top: 10px;
    position: relative;
    .info-item:not(:last-of-type) {
        margin-right: 60px;
    }
    .examined-status {
        position: absolute;
        top: -10px;
        right: 0;
        width: 81px;
        height: 71px;
    }
}
.info-item-label {
    color: #90949E;
}
.info-item-value {
    color: #242B3A;
}
.header-title {
    margin-top: 32px;
    margin-bottom: 18px;
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242B3A;
    font-weight: bold;
}
.footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    div{
        width: 80px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
    }
    div:nth-of-type(1) {
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DBE1E7;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A;
    }
    div:nth-of-type(2) {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #FFFFFF;
        background: #0057FE;
        margin-left: 12px;
    }
}
</style>
