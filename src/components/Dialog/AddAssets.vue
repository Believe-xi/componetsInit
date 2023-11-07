<template>
    <el-dialog :model-value="dialogVisible" :close-on-click-modal="false" class="lyx-dialog" width="70%"
        style="min-width: 900px;min-height: 80vh;" :before-close="handleClose">
        <template #header>
            <div class="title">{{ hc ? "新增耗材" : "新增资产" }}</div>
        </template>
        <div>
            <LyxFilter v-if="hc" :fields="fieldsHc" :formState="formState" @search="search" />
            <LyxFilter v-else :fields="fields" :formState="formState" @search="search" />
        </div>
        <el-table :data="tableDataConsumables" @selection-change="handleSelectionChange" v-if="hc">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column prop="consumablesCode" label="物料编码" />
            <el-table-column prop="consumablesName" label="耗材名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="consumablesModel" label="型号" />
            <el-table-column prop="warehouseName" label="所在库存" />
            <el-table-column prop="number" label="可用库存" />
            <el-table-column prop="consumablesUnit" label="计量单位" />
            <el-table-column prop="safeQuantity" label="安全库存" />
            <el-table-column prop="consumablesExptimee" label="有效期到期日" />
        </el-table>
        <el-table ref="tableRefs" :data="tableData" @selection-change="handleSelectionChange" v-else>
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column prop="assetsCode" label="资产编码" />
            <el-table-column prop="assetsName" label="资产名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="assetsModel" label="型号" />
            <el-table-column label="照片">
                <template #default="scope">
                    <el-button type="primary" link @click="examinedPreview(scope.row.assetsImg)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="lyx-pagination">
            <el-pagination v-model:page-size="Pagination.size" v-model::current-page="Pagination.current" background
                layout="total, prev, pager, next, sizes, jumper" :total="Pagination?.total" @size-change="handleSizeChange"
                @current-change="PaginationChange" />
        </div>
        <template #footer>
            <div class="footer">
                <div class="footer-left">
                    <!-- 共{{ tableData.length }}项，已选
                    <span style="color: #0057fe">{{ checkAssets.length }}</span>
                    项 -->
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

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import LyxFilter from "@/components/Filter/index.vue";
import { IField } from "@/types/filter";
import { list, getInventoryPageInfo, treeList } from "@/api/property";
import moment from "moment";
import { IPagination } from "@/types/table";
import { Local, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";
import { getConsumablesTree } from "@/api/consume";
import { IConsumeTree } from "@/views/Consumables/Category/props";
interface IFormState {
    code: string,
    name: string,
    dept: string,
    consumablesTypeId: string
}
interface tableItem {
    id?: string,
    code: string,
    name: string,
    brand: string,
    model: string,
    photos: Array<string>
}
export default defineComponent({
    props: {
        hc: {
            type: Boolean,
            default: false
        },
        warehouseId: {
            type: String,
            default: ""
        }
    },
    components: { LyxFilter, PhotoPreview },
    emits: ["AddTableItem"],
    setup(props, { emit }) {
        const dialogVisible = ref(false);
        const photoVisible = ref(false);
        const imgUrlList = ref<string[]>([]);
        const tableDataConsumables = ref([]);
        const arrr = ref();
        const assetCategory = ref();
        const handleOpen = (arr: string[]) => {
            dialogVisible.value = true;
            arrr.value = arr;
            if (props.hc) {
                getAssetsListHc();
            } else {
                getAssetsList();
            }
        };
        const tableRefs = ref();
        const examinedPreview = (val: string | undefined): void => {
            if (!val) {
                ElMessage.warning("暂无照片");
            } else {
                const imgs = val.split(",");
                imgUrlList.value = imgs.map(i => i.split("|")[0]);
                photoVisible.value = true;
            }
        };
        const search = (state: IFormState) => {
            formState.code = state.code;
            formState.dept = state.dept;
            formState.consumablesTypeId = state.consumablesTypeId;
            formState.name = state.name;
            if (props.hc) {
                getAssetsListHc();
            } else {
                getAssetsList();
            }
        };
        const getTreeData = async () => {
            const params = {
                assetsTypeName: "",
                code: "",
                id: "",
                level: "",
                orgId: Local.get("ORG_ID"),
                parentId: "",
                platformId: Local.get("PLATFORM_ID"),
                state: 0,
                type: 0
            };
            const res = await treeList(params);
            if (res.resultCode !== 200) return [];
            return res.result;
        };
        const getTreeDataa = async () => {
            const res = await getConsumablesTree<IConsumeTree[]>();
            if (res.resultCode !== 200) return [];
            return res.result;
        };
        const fieldsHc: IField[] = [
            {
                key: "code",
                name: "耗材编码：",
                component: "input"
            },
            {
                key: "name",
                name: "耗材名称：",
                component: "input"
            },
            {
                key: "consumablesTypeId",
                name: "耗材品目",
                component: "selectTree",
                placeholder: "请选择",
                IFunc: getTreeDataa
            }
        ];
        const fields: IField[] = [
            {
                key: "code",
                name: "资产编码：",
                component: "input"
            },
            {
                key: "name",
                name: "资产名称：",
                component: "input"
            },
            {
                key: "dept",
                name: "资产品目",
                component: "selectTree",
                placeholder: "请选择",
                IFunc: getTreeData
            }
        ];
        const formState: IFormState = {
            code: "",
            name: "",
            dept: "",
            consumablesTypeId: ""
        };
        const Pagination = ref<IPagination>({
            current: 1,
            size: 10,
            total: 0
        });
        const handleSizeChange = (page: number) => {
            Pagination.value.size = page;
            getAssetsList();
        };
        const PaginationChange = (page: number) => {
            Pagination.value.current = page;
            getAssetsList();
        };
        const handleClose = () => {
            dialogVisible.value = false;
        };
        const handleSubmit = () => {
            dialogVisible.value = false;
            emit("AddTableItem", checkAssets.value);
        };
        const checkAssets = ref<tableItem[]>([]);
        const handleSelectionChange = (val: tableItem[]) => {
            checkAssets.value = val;
        };
        const tableData = ref<tableItem[]>([]);
        const getAssetsList = async () => {
            const params = {
                assetsCode: formState.code,
                assetsName: formState.name,
                assetsStatus: "1",
                assetsTypeId: formState.dept,
                deptName: "",
                endAssetsBuytime: "",
                endBackTime: "",
                endUseTime: "",
                platformId: Local.get(STORAGE_TYPES.PLATFORM_ID),
                orgId: Local.get(STORAGE_TYPES.ORG_ID),
                pageNumber: Pagination.value.current,
                pageSize: Pagination.value.size,
                startAssetsBuytime: "",
                startBackTime: "",
                startUseTime: "",
                userName: "",
                warehouseId: props.warehouseId
            };
            const res = await list(params);
            Pagination.value.current = res.result?.pageNum;
            Pagination.value.size = res.result?.pageSize;
            Pagination.value.total = res.result?.total;
            tableData.value = [];
            tableData.value = res.result?.list?.map((item: any) => {
                return item;
            });
            nextTick(() => {
                tableData.value.forEach((item: tableItem) => {
                    if (arrr.value.indexOf(item.id!) !== -1) {
                        tableRefs.value!.toggleRowSelection(item, true);
                    }
                });
            });
        };
        const getAssetsListHc = async () => {
            const params = {
                consumablesCode: formState.code,
                consumablesName: formState.name,
                consumablesTypeId: formState.consumablesTypeId,
                endDate: "",
                isAll: true,
                pageNumber: 1,
                pageSize: 10,
                platformId: Local.get(STORAGE_TYPES.PLATFORM_ID),
                orgId: Local.get(STORAGE_TYPES.ORG_ID),
                startDate: "",
                warehouseId: props.warehouseId
            };
            const res = await getInventoryPageInfo(params);
            Pagination.value.current = res.result?.pageNum;
            Pagination.value.size = res.result?.pageSize;
            Pagination.value.total = res.result?.total;
            tableDataConsumables.value = [];
            tableDataConsumables.value = res.result?.list?.map((item: any) => {
                item.consumablesExptimee = item.consumablesExptime ? moment(item.consumablesExptime).format("YYYY-MM-DD") : null;
                return item;
                // {
                //     index: index,
                //     code: item.consumablesCode,
                //     name: item.consumablesName,
                //     brand: item.brand,
                //     model: item.consumablesModel,
                //     warehouse: item.warehouseName,
                //     availableStock: item.number,
                //     unit: item.consumablesUnit,
                //     secureWarehouse: item.safeQuantity,
                //     periodOfValidity: item.consumablesExptime,
                //     img: item.consumablesTagImg
                // };
            });
            nextTick(() => {
                tableData.value.forEach((item: tableItem) => {
                    if (arrr.value.indexOf(item.id!) !== -1) {
                        tableRefs.value!.toggleRowSelection(item, true);
                    }
                });
            });
        };
        return {
            tableRefs,
            dialogVisible,
            fields,
            handleOpen,
            handleClose,
            handleSubmit,
            formState,
            tableData,
            checkAssets,
            handleSelectionChange,
            tableDataConsumables,
            Pagination,
            PaginationChange,
            arrr,
            handleSizeChange,
            assetCategory,
            search,
            examinedPreview,
            photoVisible,
            imgUrlList,
            fieldsHc
        };
    }
});
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

        .btn-next,
        .btn-prev {
            border: 1px solid #DBE1E7;
            border-radius: 4px;
        }
    }
}
</style>
