<template>
    <el-dialog :model-value="dialogVisible" :close-on-click-modal="false" class="lyx-dialog" width="70%"
        style="min-width: 900px;min-height: 80vh;" :before-close="handleClose" @open="open">
        <template #header>
            <div class="title">{{ title }}</div>
        </template>
        <div v-if="tipStatus" class="tip">
            <img src="@/assets/img/icon_tips_small@2x.png" alt="" />
            <p>
                驳回原因：{{ rejectionReason }}
            </p>
        </div>
        <el-row>
            <el-row :gutter="20" v-if="notesLabel === '处置备注：'">
                <el-col :span="6">
                    <el-form-item label="单据编号：">
                        <el-input v-model="form.code" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发起人：">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="处置类型：">
                        <el-select v-model="form.type" class="m-2" placeholder="请选择">
                            <el-option v-for="(item, index) in disposalType" :key="index" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发起时间：">
                        <el-date-picker v-model="form.time" type="date" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else-if="notesLabel === '报修原因：'">
                <el-col :span="8">
                    <el-form-item label="单据编号：">
                        <el-input v-model="form.code" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报修人：">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报修时间：">
                        <el-date-picker v-model="form.time" type="date" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else-if="notesLabel === '调拨备注：'">
                <el-col :span="8">
                    <el-form-item label="单据编号：">
                        <el-input v-model="form.code" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发起人：">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发起时间：">
                        <el-date-picker v-model="form.time" type="date" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else>
                <el-col :span="8">
                    <el-form-item label="单据编号：">
                        <el-input v-model="form.code" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理人：">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入库时间：">
                        <el-date-picker v-model="form.time" type="date" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-row>
        <el-row :gutter="20" v-if="notesLabel === '调拨备注：'">
            <el-col :span="8">
                <el-form-item label="调出仓库：">
                    <!-- <el-input v-model="" /> -->
                    <el-select v-model="form.out" class="m-2" placeholder="请选择调出仓库">
                        <el-option v-for="(item, index) in warehouseData" :key="index" :label="item?.name"
                            :value="item?.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="调入仓库：">
                    <el-select v-model="form.in" class="m-2" placeholder="请选择调入仓库">
                        <el-option v-for="(item, index) in warehouseData?.filter(v => v.state === 0)" :key="index"
                            :label="item?.name" :value="item?.id" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form-item :label="notesLabel">
                    <el-input type="textarea" :rows="3" v-model="form.remark" />
                </el-form-item>
            </el-col>
        </el-row>
        <div class="header-title">
            <p>{{ secondTitle }}列表</p>
            <div class="header-btns" v-if="title === '资产维修单' || title === '资产处置单' || title === '耗材处置单'">
                <div @click="handleAddAssets">
                    <img src="@/assets/img/icon_add_btn_blue@2x.png" alt="" />
                    <span>手动新增</span>
                </div>
                <div @click="handleScan">
                    <img src="@/assets/images/icon_add_btn@2x.png" alt="" />
                    <span>扫码新增</span>
                </div>
            </div>
            <el-button v-else type="primary" :disabled="title === '耗材调拨单' && !form.out" @click="handleAddAssets">
                <img style="width: 18px; margin-right: 5px;" src="@/assets/img/icon_add_btn@2x.png" alt="" />
                <span>添加</span>
            </el-button>
        </div>
        <el-table :data="tableDataConsumables" v-if="hc">
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column prop="consumablesCode" label="物料编码" />
            <el-table-column prop="consumablesName" label="耗材名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="consumablesModel" label="型号" />
            <el-table-column prop="number" label="可用库存" />
            <el-table-column prop="consumablesUnit" label="计量单位" />
            <el-table-column prop="warehouseName" label="存放位置" />
            <el-table-column label="照片">
                <template #default="scope">
                    <span style="color: #0057fe; cursor: pointer" @click="examinedPreview(scope.row.consumablesImg)">
                        查看
                    </span>
                </template>
            </el-table-column>
            <el-table-column v-if="draftStatus" prop="input" :label="hccz ? '处置数量' : '调拨数量'">
                <template #default="scope">
                    <el-input v-model="scope.row.input" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button @click="handleDelete(scope.$index)" link type="danger" size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-table :data="tableData" v-else>
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column prop="assetsCode" label="资产编码" />
            <el-table-column prop="assetsName" label="资产名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="assetsModel" label="型号" />
            <el-table-column v-if="draftStatus" prop="month" width="140" label="预计使用期限 (月)" />
            <el-table-column label="照片">
                <template #default="scope">
                    <span style="color: #0057fe; cursor: pointer" @click="examinedPreview(scope.row.assetsImg)">
                        查看
                    </span>
                </template>
            </el-table-column>
            <el-table-column v-if="draftStatus" prop="position" label="存放位置">
                <template #default="scope">
                    <el-select v-model="scope.row.position">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button v-if="draftStatus" link type="primary" size="small"
                        @click="handleEdit(scope.row, scope.$index)">
                        编辑
                    </el-button>
                    <el-button v-if="draftStatus" link type="primary" size="small">
                        复制
                    </el-button>
                    <el-button @click="handleDelete(scope.$index)" link type="danger" size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="footer">
                <div @click="handleSubmit(1)" class="footer-left" :style="draftButton === true ? '' : 'visibility: hidden'">
                    <img src="@/assets/img/icon_caogao@2x.png" alt="" />
                    保存为草稿
                </div>
                <div class="footer-right">
                    <div @click="handleClose">取消</div>
                    <div @click="handleSubmit(2)">提交</div>
                </div>
            </div>
        </template>
    </el-dialog>
    <AddAsset ref="AddAssetRef" @AddTableItem="AddTableItem" :warehouseId="form.out" :hc="hc"></AddAsset>
    <NewAddAssetList v-if="isShowAddItems" v-model:isShowAddItems="isShowAddItems" :editInfo="editInfo"
        @handleAddSubmit="handleAddSubmit" />
    <PhotoPreview v-model:visible="photoVisible" :urlList="imgUrlList" />
    <ScanAddAssets
        v-if="isShowScanAdd"
        v-model:isShowScanAdd="isShowScanAdd"
        :scanType="hc ? 2 : 1"
        :listType="title"
        @confirm="handleScanData"
    />
</template>

<script lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import AddAsset from "./AddAssets.vue";
import { formatDate, toUTCDate } from "@/utils/dealData";
import NewAddAssetList from "./NewAddAssetList.vue";
import store from "@/store";
import { Local } from "@/utils/storage";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";
import ScanAddAssets from "@/components/Dialog/ScanAddAssets.vue";
// import { warehouseList } from "@/api/property";
interface tableItem {
    id?: string;
    code: string;
    name: string;
    brand: string;
    model: string;
    photos: Array<string>;
    month?: string;
    position?: string;
}
export default defineComponent({
    props: {
        title: {
            type: String,
            default: "资产入库单", // 四个汉字首字母加年月日时分秒四位随机数
            require: true
        },
        secondTitle: {
            type: String,
            default: "资产",
            require: true
        },
        // 提示
        tipStatus: {
            type: Boolean,
            default: true
        },
        // 保存为草稿、存放年月、月份
        draftStatus: {
            type: Boolean,
            default: true
        },
        draftButton: {
            type: Boolean,
            default: true
        },
        repairNumber: {
            type: String,
            default: ""
        },
        hc: { // 耗材
            type: Boolean,
            default: false
        },
        hccz: { // 耗材处置
            type: Boolean,
            default: false
        },
        notesLabel: {
            type: String,
            default: "入库备注：",
            require: true
        },
        warehouseData: {
            type: Array,
            default: () => [] as any
        }
    },
    components: { AddAsset, NewAddAssetList, PhotoPreview, ScanAddAssets },
    emits: ["handleView", "saveDraft", "assetRepairOrder"],
    setup(props, { emit }) {
        const form = ref({ id: "", code: "", name: "", time: "", remark: "", out: "", in: "", type: "" });
        const dialogVisible = ref(false);
        const tableData = ref<tableItem[]>([]);
        const tableDataConsumables = ref<any[]>([]);
        const photoVisible = ref(false);
        const imgUrlList = ref<string[]>([]);
        const rejectionReason = ref();
        const disposalType = ref([
            {
                name: "报废",
                value: 1
            },
            {
                name: "丢失",
                value: 2
            },
            {
                name: "转让",
                value: 3
            },
            {
                name: "退租",
                value: 4
            },
            {
                name: "其他",
                value: 5
            }
        ]);
        const examinedPreview = (val: string | undefined): void => {
            if (!val) {
                ElMessage.warning("暂无照片");
            } else {
                const imgs = val.split(",");
                imgUrlList.value = imgs.map(i => i.split("|")[0]);
                photoVisible.value = true;
            }
        };
        const openDialog = (row: any) => {
            if (!row) {
                form.value = {
                    id: "",
                    code: props.repairNumber,
                    name: Local.get("USER_NAME"),
                    time: formatDate(new Date(), "YYYY-MM-DD"),
                    remark: "",
                    out: "",
                    in: "",
                    type: ""
                };
                if (store.state.selectRows.length > 0) {
                    tableData.value = store.state.selectRows;
                } else {
                    tableData.value = [];
                }
                if (store.state.consumablesDisposal) {
                    tableDataConsumables.value = JSON.parse(JSON.stringify(store.state.consumablesList));
                } else {
                    tableDataConsumables.value = [];
                }
                dialogVisible.value = true;
            } else {
                rejectionReason.value = row.approvalOpinion;
                if (props.notesLabel === "处置备注：" && props.hc === false) {
                    form.value = {
                        id: row.id,
                        code: row.code,
                        name: row.promoter,
                        time: row.disposeOfTime,
                        remark: row.notes,
                        out: row?.outWarehouseId,
                        in: row?.inWarehouseId,
                        type: row.types
                    };
                } else {
                    form.value = {
                        id: row.id,
                        code: row.approvalNo,
                        name: row.createName,
                        time: row.createTime,
                        remark: row.applicationNotes,
                        out: row?.outWarehouseId,
                        in: row?.inWarehouseId,
                        type: row.types
                    };
                }
                if (props.hc) {
                    tableDataConsumables.value = row.consumablesDetailList?.map((item, index) => {
                        index = index + 1;
                        item.assetsImg = item.consumablesImg;
                        item.input = item.applyNumber;
                        return item;
                        // {
                        //     id: item.id,
                        //     index: index + 1,
                        //     consumablesCode: item.consumablesCode,
                        //     consumablesName: item.consumablesName,
                        //     brand: item.brand,
                        //     assetsModel: item.assetsModel,
                        //     number: item.number,
                        //     assetsImg: item.consumablesImg,
                        //     consumablesUnit: item.consumablesUnit,
                        //     warehouseName: item.warehouseName,
                        //     input: item.applyNumber
                        // };
                    });
                } else {
                    tableData.value = row.assetsInfoVOList?.map((item, index) => {
                        return {
                            id: item.id,
                            index: index + 1,
                            assetsCode: item.assetsCode,
                            assetsName: item.assetsName,
                            brand: item.brand,
                            assetsModel: item.assetsModel,
                            assetsImg: item.assetsImg,
                            position: item.warehouseName
                        };
                    });
                }
                dialogVisible.value = true;
            }
        };
        const handleSubmit = (val) => {
            if (!form.value.name) {
                ElMessage.warning("请输入发起人");
            } else if (props.notesLabel === "处置备注：" && !form.value.type) {
                ElMessage.warning("请选择处置类型");
            } else if (!form.value.time) {
                ElMessage.warning("请选择发起时间");
            } else if (props.notesLabel === "调拨备注：" && !form.value.out) {
                ElMessage.warning("请选择调出仓库");
            } else if (props.notesLabel === "调拨备注：" && !form.value.in) {
                ElMessage.warning("请选择调入仓库");
            } else {
                form.value.time = toUTCDate(form.value.time);
                if (props.hc) {
                    emit("assetRepairOrder", form.value, tableDataConsumables.value, val);
                } else {
                    emit("assetRepairOrder", form.value, tableData.value, val);
                }
            }
        };
        const handleClose = () => {
            dialogVisible.value = false;
            store.commit("setAssetRepair", false);
            store.commit("setAssetDisposal", false);
            store.commit("setSelectRows", []);
            store.commit("setConsumablesDisposal", false);
            store.commit("setConsumablesList", []);
        };
        const AddTableItem = (val: tableItem[]) => {
            tableDataConsumables.value = val;
            tableData.value = val;
        };
        const handleView = () => {
            emit("handleView");
        };
        const handleDelete = (index: number) => {
            ElMessageBox.confirm("是否确定移除该条资产？", "Warning", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning",
                title: "移除"
            })
                .then(() => {
                    tableData.value.splice(index, 1);
                    tableDataConsumables.value.splice(index, 1);
                })
                .catch(() => { });
        };
        const saveDraft = () => {
            emit("saveDraft");
        };
        const AddAssetRef = ref();
        const handleAddAssets = () => {
            AddAssetRef.value.handleOpen(
                tableData.value.map((item: tableItem) => item.id)
            );
        };
        const isShowAddItems = ref(false);
        const editInfo = ref();
        const handleAddNewAssets = () => {
            isShowAddItems.value = true;
            editInfo.value = {};
        };
        const editActiveIndex = ref(0);
        const handleEdit = (row, index) => {
            editInfo.value = row;
            editActiveIndex.value = index;
            isShowAddItems.value = true;
        };
        const handleAddSubmit = (form, str) => {
            if (str === "add") {
                tableData.value.push({
                    id: "1",
                    code: form.assetCode,
                    name: form.name,
                    brand: form.brand,
                    model: form.model,
                    photos: form.uploadImgs,
                    month: form.date,
                    position: ""
                });
            } else {
                tableData.value[editActiveIndex.value] = {
                    id: "1",
                    code: form.assetCode,
                    name: form.name,
                    brand: form.brand,
                    model: form.model,
                    photos: form.uploadImgs,
                    month: form.date,
                    position: ""
                };
            }
            isShowAddItems.value = false;
        };
        const open = () => {
            if (!form.value.code) {
                form.value.code = props.repairNumber;
            }
        };
        // 扫码新增
        const isShowScanAdd = ref(false);
        const handleScan = () => {
            isShowScanAdd.value = true;
        };
        const handleScanData = (data) => {
            isShowScanAdd.value = false;
            tableDataConsumables.value = data;
            tableData.value = data.concat(tableData.value);
        };
        return {
            dialogVisible,
            openDialog,
            form,
            handleSubmit,
            handleClose,
            tableData,
            handleView,
            saveDraft,
            handleDelete,
            AddAssetRef,
            AddTableItem,
            handleAddAssets,
            isShowAddItems,
            editInfo,
            handleAddNewAssets,
            handleAddSubmit,
            handleEdit,
            open,
            tableDataConsumables,
            disposalType,
            photoVisible,
            imgUrlList,
            examinedPreview,
            rejectionReason,
            handleScan,
            isShowScanAdd,
            handleScanData
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

.tip {
    margin: 16px 0;
    width: 100%;
    height: 32px;
    background: #fef6e7;
    display: flex;
    align-items: center;
    padding: 0 12px;

    img {
        width: 16px;
        height: 16px;
        margin-right: 14px;
    }

    p {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242b3a;
    }
}

.header-title {
    display: flex;
    justify-content: space-between;
    width: 100%;

    p {
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #242b3a;
        font-weight: bold;
    }

    .header-btns {
        display: flex;

        div {
            cursor: pointer;
            width: 95px;
            border-radius: 4px;
            height: 32px;
            box-shadow: 0 0 0 1px #0057fe;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 12px;

            img {
                width: 16px;
                height: 16px;
                margin-right: 6px;
            }

            span {
                font-size: 14px;
                font-family: HarmonyOS_Sans_SC;
                color: #0057fe;
            }
        }
    }
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
        color: #0057fe;
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
</style>
