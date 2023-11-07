<template>
    <el-dialog
        :model-value="isShowScanAdd"
        :append-to-body="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="600px"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="scan-add__title">扫码盘点资产</div>
        </template>
        <input class="scan-input" ref="inputRef" v-model="scanValue" @input="handleInput" @blur="handleBlur"/>
        <div class="table-null">
            <img src="@/assets/images/pic_none@2x.png" alt="">
            <div>请使用扫码枪扫描您盘点的资产标签</div>
        </div>
    </el-dialog>
    <ScanInventoryList
        v-model:isShowScanData="isShowScanData"
        :assetId="assetId"
        :inventoryId="inventoryId"
        @next="handleNext"
    />
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { debounce } from "lodash";
import { getDetail } from "@/api/property";
import { IRgetDetailList } from "@/types/property";
import ScanInventoryList from "@/components/Dialog/ScanInventoryList.vue";

const props = defineProps({
    isShowScanAdd: {
        type: Boolean,
        default: false
    },
    checkId: {
        type: String,
        default: ""
    }
});

const emit = defineEmits(["update:isShowScanAdd", "update"]);

const handleClose = () => {
    emit("update:isShowScanAdd", false);
    if (isUpdate.value) {
        emit("update");
    }
};

// 资产
const assetList = ref<IRgetDetailList[]>([]);
const getAssetData = async () => {
    const res = await getDetail({
        checkId: props.checkId,
        pageNumber: 1,
        pageSize: 99999
    });
    if (res.resultCode !== 200) return;
    assetList.value = res.result.list;
};
getAssetData();

watch(
    () => props.isShowScanAdd,
    (value) => {
        if (value) {
            getAssetData();
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

// 扫描成功 确认数据
const isShowScanData = ref(false);
const scanValue = ref("");
const inputRef = ref();
const assetId = ref("");
const inventoryId = ref("");

const handleInput = debounce((val) => {
    if (val.srcElement.value) {
        const Id = assetList.value.find(item => item.assetsCode === val.srcElement.value)?.assetsId;
        const iventId = assetList.value.find(item => item.assetsCode === val.srcElement.value)?.id;
        if (Id) {
            assetId.value = Id;
            isShowScanData.value = true;
        }
        if (iventId) {
            inventoryId.value = iventId;
        }
        scanValue.value = "";
    }
}, 300);

const handleBlur = () => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
};

const isUpdate = ref(false);
const handleNext = () => {
    isShowScanData.value = false;
    isUpdate.value = true;
    if (inputRef.value) {
        inputRef.value.focus();
    }
};

</script>

<style lang="scss" scoped>
.scan-add__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}

.table-null {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: 90px 0 110px;

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

.scan-input {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    border: transparent;
}

</style>
