<template>
    <el-dialog :model-value="visible" :close-on-click-modal="false" class="lyx-dialog" width="70%" :before-close="handleClose" style="min-width: 900px;min-height: 80vh;">
        <template #header>
            <div class="title">{{ title }}</div>
        </template>
        <LyxFilter :fields="fields" :formState="formState" @search="onFilter" />
        <el-table ref="tableRefs" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column prop="assetsCode" label="资产编码" />
            <el-table-column prop="assetsName" label="资产名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="assetsModel" label="型号" />
            <el-table-column label="照片">
                <template #default="scope">
                    <el-button type="primary" link @click="preview(scope.row.assetsImg)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="lyx-pagination">
            <el-pagination
                v-if="showPagination"
                v-model:page-size="pagination.size"
                v-model::current-page="pagination.current"
                background
                layout="total, prev, pager, next, sizes, jumper"
                :total="pagination?.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <template #footer>
            <div class="footer">
                <div class="footer-left">
                    共{{ tableData.length }}项，已选
                    <span style="color: #0057fe">{{ checkAssets.length }}</span>
                    项
                </div>
                <div class="footer-right">
                    <div @click="handleClose">取消</div>
                    <div @click="handleSubmit">提交</div>
                </div>
            </div>
        </template>
    </el-dialog>
    <PhotoPreview v-model:visible="photoVisible" :urlList="imgUrlList" />
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from "vue";
import LyxFilter from "@/components/Filter/index.vue";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";
import { ElMessage } from "element-plus";
import { IField, IFormState } from "@/types/filter";
import { IPagination } from "@/types/table";
import { Local, STORAGE_TYPES } from "@/utils/storage";
import { getAssetsList, getCategoryTree } from "@/api/assetManagement";
import { AssetsInfoVOItem, IPaginationResponse } from "@/types/assetManagement";
import { IListData } from "@/views/AssetManagement/Category/props";

const emit = defineEmits(["confirm"]);
const formState: IFormState = {
    assetsCode: "",
    assetsName: "",
    assetsTypeId: ""
};
const getTreeData = async () => {
   const res = await getCategoryTree<IListData[]>();
    if (res.resultCode !== 200) return [];
    return res.result;
};
const fields: IField[] = [
    {
        key: "assetsCode",
        name: "资产编码：",
        component: "input"
    },
    {
        key: "assetsName",
        name: "资产名称：",
        component: "input"
    },
    {
        key: "assetsTypeId",
        name: "资产品目：",
        component: "selectTree",
        IFunc: getTreeData
    }
];
const form = ref<IFormState>({
    assetsCode: "",
    assetsName: "",
    assetsTypeId: ""
});
const pagination = ref<IPagination>({
    current: 1,
    size: 10,
    total: 0
});
const visible = ref(false);
const title = ref("新增资产");
const tabType = ref(0);
const tableRefs = ref();
const tableData = ref<AssetsInfoVOItem[]>([]);
const showPagination = computed(() => {
    return !!pagination.value;
});
const handleOpen = async (val: number, selectData: AssetsInfoVOItem[]) => {
    visible.value = true;
    tabType.value = val;
    await assetsListSearch();
    if (!selectData.length) return;
    checkAssets.value = selectData;
    const ids = selectData.map(i => i.id);
    nextTick(() => {
        tableData.value.forEach((item) => {
            if (ids.indexOf(item.id!) !== -1) {
                tableRefs.value!.toggleRowSelection(item, true);
            }
        });
    });
};
const assetsListSearch = async () => {
    const params = {
        ...form.value,
        assetsStatus: 1,
        pageNumber: pagination.value.current,
        pageSize: pagination.value.size,
        platformId: Local.get(STORAGE_TYPES.PLATFORM_ID),
        orgId: Local.get(STORAGE_TYPES.ORG_ID)
    };
    if (tabType.value) {
        params.assetsStatus = 3;
    }
    const res = await getAssetsList<IPaginationResponse<AssetsInfoVOItem[]>>(params);
    if (res.resultCode !== 200) return;
    tableData.value = res.result.list;
    pagination.value.current = res.result.pageNum;
    pagination.value.size = res.result.pageSize;
    pagination.value.total = res.result.total;
};
const onFilter = (val) => {
    form.value = { ...form.value, ...val };
    assetsListSearch();
};
const handleSizeChange = (val: number) => {
    pagination.value = { ...pagination.value, size: val };
    assetsListSearch();
};
const handleCurrentChange = (val: number) => {
    pagination.value = { ...pagination.value, current: val };
    assetsListSearch();
};
const handleClose = () => {
    visible.value = false;
    checkAssets.value = [];
    tableData.value = [];
};
const handleSubmit = () => {
    visible.value = false;
    emit("confirm", checkAssets.value);
    checkAssets.value = [];
    tableData.value = [];
};
const checkAssets = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {
    checkAssets.value = JSON.parse(JSON.stringify(val));
};
/* 查看照片 */
const photoVisible = ref(false);
const imgUrlList = ref<string[]>([]);
const preview = (val: string) => {
    if (!val) {
        ElMessage.warning("暂无照片");
    } else {
        const list = val.split(",");
        imgUrlList.value = list?.map(i => i.split("|")[0]);
        photoVisible.value = true;
    }
};
defineExpose({ handleOpen });
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242b3a;
    font-weight: bold;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-left {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        cursor: pointer;

        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
    }

    .footer-right {
        display: flex;
        align-items: center;

        div {
            width: 80px;
            height: 32px;
            border-radius: 4px;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
        }

        div:nth-of-type(1) {
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dbe1e7;
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC;
            color: #242b3a;
        }

        div:nth-of-type(2) {
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC;
            color: #ffffff;
            background: #0057fe;
            margin-left: 12px;
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
