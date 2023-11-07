<template>
    <el-dialog
        :model-value="isShowScanAdd"
        :append-to-body="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="70%"
        style="min-width: 900px;min-height: 80vh;"
        @close="handleClose"
        class="lyx-dialog scan-dialog"
    >
        <template #header>
            <div class="scan-add__title">扫码选择{{ scanType === 1 ? "资产" : "耗材" }}</div>
        </template>

        <input class="scan-input" ref="inputRef" v-model="scanValue" @input="handleInput" @blur="handleBlur"/>

        <LyxTable v-if="tableData.length > 0" :tableData="tableData" :columns="column">
            <template #assetsImg="scope">
                <el-button type="primary" link @click="handleView(scope.row.assetsImg)">查看</el-button>
            </template>
            <template #option="scope">
                <el-button type="danger" link @click="handleDelete(scope.row.id)">移除</el-button>
            </template>
            <template #consumablesExptime="scope">
                <span v-if="scope.row.consumablesExptime">
                    {{ dayjs(scope.row.consumablesExptime).format("YYYY-MM-DD") }}
                </span>
                <span v-else>--</span>
            </template>
        </LyxTable>
        <div class="table-null" v-else>
            <img src="@/assets/images/pic_none@2x.png" alt="">
            <div>请使用扫码枪扫描标签上的二维码</div>
        </div>
        <template #footer>
            <div class="scan-footer">
                <div class="scan__number">
                    <span v-if="tableData.length > 0">共{{ tableData.length }}个</span>
                </div>
                <div>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
    <PhotoPreview v-model:visible="photoVisible" :urlList="imgUrlList" />

</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import LyxTable from "@/components/LyxTable/index.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { ITableColumn } from "@/types/table";
import { getAssetsList } from "@/api/assetManagement";
import { IAssetTabel, IbaseInfo } from "@/views/AssetManagement/List/props";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";
import { getInventoryPageInfo } from "@/api/consume";
import { debounce } from "lodash";

const props = defineProps({
    isShowScanAdd: {
        type: Boolean,
        default: false
    },
    scanType: {
        type: Number,
        default: 1
    },
    listType: {
        type: String,
        default: ""
    }
});

const emit = defineEmits(["update:isShowScanAdd", "confirm"]);

const handleClose = () => {
    emit("update:isShowScanAdd", false);
};

// 资产
const assetList = ref<IbaseInfo[]>([]);
const getAssetData = async () => {
    const res = await getAssetsList<IAssetTabel>({
        assetsCode: "",
        pageNumber: 1,
        pageSize: 99999
    });
    if (res.resultCode !== 200) return;
    assetList.value = res.result.list;
};

// 耗材
const consumableList = ref<any>([]);
const getConsumableData = async () => {
    const res = await getInventoryPageInfo<any>({
        consumablesCode: "",
        pageNumber: 1,
        pageSize: 99999
    });
    if (res.resultCode !== 200) return;
    consumableList.value = res.result.list;
};

// 扫码
const scanValue = ref("");
const inputRef = ref();
const tableData = ref<any[]>([]);

const handleInput = debounce((val) => {
    if (val.srcElement.value) {
        let data: any;
        if (props.scanType === 1) {
            data = assetList.value.find(item => item.assetsCode === val.srcElement.value);
        } else {
            data = consumableList.value.find(item => item.consumablesCode === val.srcElement.value);
        }
        if (JSON.stringify(data) !== "{}" && typeof data !== "undefined") {
            if (props.scanType !== 1) {
                tableData.value.push(data);
                scanValue.value = "";
                return;
            }
            if (props.listType.includes("借用")) {
                if (data.assetsStatus === "1") {
                    tableData.value.push(data);
                } else {
                    ElMessage.error(`该资产状态为${data.assetsStatus === "2" || data.assetsStatus === "3" ? "在用" : data.assetsStatus === "4" ? "维修中" : "已处置"}, 无法借用`);
                }
            } else if (props.listType.includes("归还")) {
                if (["2", "3"].includes(data.assetsStatus)) {
                    tableData.value.push(data);
                } else {
                    ElMessage.error(`该资产状态为${data.assetsStatus === "1" ? "空闲" : data.assetsStatus === "4" ? "维修中" : "已处置"}, 无法归还`);
                }
            } else if (props.listType.includes("维修")) {
                if (["1", "2", "3"].includes(data.assetsStatus)) {
                    tableData.value.push(data);
                } else {
                    ElMessage.error(`该资产状态为${data.assetsStatus === "4" ? "维修中" : "已处置"}, 无法维修`);
                }
            } else if (props.listType.includes("处置")) {
                if (["1", "2", "3", "4"].includes(data.assetsStatus)) {
                    tableData.value.push(data);
                } else {
                    ElMessage.error("该资产的状态为已处置, 无法申请处置");
                }
            }
            scanValue.value = "";
        } else {
            if (props.scanType === 2) {
                ElMessage.error("该耗材没有库存!");
                scanValue.value = "";
            }
        }
    }
}, 300);

const handleBlur = () => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
};

watch(
    () => props.isShowScanAdd,
    (value) => {
        if (value) {
            props.scanType === 1 ? getAssetData() : getConsumableData();
            setTimeout(() => {
                nextTick(() => {
                    if (inputRef.value) {
                        inputRef.value.focus();
                    }
                });
            }, 500);
        }
    },
    {
        deep: true,
        immediate: true
    }
);

// 照片
const photoVisible = ref(false);
const imgUrlList = ref<string[]>([]);
const handleView = (row: string) => {
    if (row) {
        const list = row.split(",");
        imgUrlList.value = list?.map(i => i.split("|")[0]);
        photoVisible.value = true;
    } else {
        ElMessage.warning("暂无图片");
    }
};

const handleDelete = (Id) => {
    tableData.value = tableData.value.filter(item => item.id !== Id);
};

const handleConfirm = () => {
    emit("confirm", tableData.value);
};

const column = ref<ITableColumn[]>([]);
onMounted(() => {
    column.value = props.scanType === 1 ? assetsColumns : consumeColumns;
});

const assetsColumns: ITableColumn[] = [
    {
        type: "index",
        label: "序号",
        width: "80"
    },
    {
        prop: "assetsCode",
        label: "资产编码"
    },
    {
        prop: "assetsName",
        label: "资产名称"
    },
    {
        prop: "brand",
        label: "品牌"
    },
    {
        prop: "assetsModel",
        label: "型号"
    },
    {
        prop: "assetsImg",
        label: "照片",
        custom: true
    },
    {
        prop: "option",
        label: "操作",
        custom: true
    }
];

const consumeColumns: ITableColumn[] = [
    {
        type: "index",
        label: "序号",
        width: "80"
    },
    {
        prop: "consumablesCode",
        label: "物料编码"
    },
    {
        prop: "consumablesName",
        label: "耗材名称"
    },
    {
        prop: "consumablesTypeName",
        label: "所属品目"
    },
    {
        prop: "brand",
        label: "品牌"
    },
    {
        prop: "consumablesModel",
        label: "型号"
    },
    {
        prop: "warehouseName",
        label: "所在仓库"
    },
    {
        prop: "number",
        label: "可用库存"
    },
    {
        prop: "consumablesUnit",
        label: "计量单位"
    },
    {
        prop: "safeQuantity",
        label: "安全库存"
    },
    {
        prop: "consumablesExptime",
        label: "有效到期日",
        custom: true
    }
];

</script>

<style lang="scss" scoped>
.scan-add__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}
.scan-dialog {
    position: relative;
}
.scan-header {
    font-size: 14px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC;
    margin: 16px 0;

    :deep(.el-button.is-text) {
        color: #0057FE;
    }

    .scan__loading {
        color: #0057FE;
        margin-left: 16px;
        cursor: pointer;
        .el-icon {
            vertical-align: middle;
            margin-top: -3px;
        }
    }
}

.table-null {
    position: absolute;
    top: calc(50% - 124px);
    left: calc(50% - 118px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    img {
        width: 118px;
        height: 124px;
        margin: 0 auto;
    }
    div {
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC;
        color: #90949E;
    }
}

.scan-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #EFF2F5;
    .scan__number {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #90949E;
    }
}

.scan-input {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    border: transparent;
}

</style>
