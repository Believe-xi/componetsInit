<template>
    <el-dialog
        :model-value="isShowAddList"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="80%"
        style="min-width: 900px;min-height: 80vh;"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="chemicals__title">危化品{{ title }}单</div>
        </template>

        <div v-if="rowData?.status === 4" class="tip">
            <div>
                <img src="@/assets/img/icon_tips_small@2x.png" alt="" />驳回原因
            </div>
            <p>{{ rowData?.approvalOpinion }}</p>
        </div>

        <el-form>
            <el-form-item
                v-for="item in formData"
                :key="item.Id"
                :label="item.Name + '：'"
                :class="{ itemNoWrap: item.type === 'textarea' }"
            >
                <el-input
                    :disabled="item.disable"
                    style="margin-right: 15px;"
                    v-if="item.type === 'input'"
                    v-model="item.value"
                />

                <el-input
                    :autosize="{ minRows: 3 }"
                    v-if="item.type === 'textarea'"
                    v-model="item.value"
                    type="textarea"
                />

                <el-select
                    v-if="item.type === 'select'"
                    v-model="item.value"
                    style="margin-right: 15px;"
                >
                    <el-option
                        v-for="option in item.data"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                     />
                </el-select>

                <el-date-picker
                    v-if="item.type === 'date'"
                    clearable
                    type="date"
                    v-model="item.value"
                    placeholder="请选择日期"
                    value-format="YYYY-MM-DD hh:mm:ss"
                    style="margin-right: 15px;"
                />
            </el-form-item>
        </el-form>

        <div class="table__title">
            <h3>危化品列表</h3>
            <el-button v-if="title === '入库'" type="primary" :icon="Plus" @click="handleAdd({}, -1)">新增</el-button>
            <el-button v-else type="primary" :icon="Plus" @click="handleAddItem">添加</el-button>
        </div>

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
            <template #assetsImg="scope">
                <el-button type="primary" link @click="handleView(scope.row.assetsImg)">查看</el-button>
            </template>
            <template #warehouseName="scope">
                <el-select v-model="scope.row.warehouseId" v-if="title === '入库'">
                    <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <span v-else>{{ scope.row.warehouseName }}</span>
            </template>
            <template #option="scope">
                <el-button v-if="title === '入库'" type="primary" link @click="handleAdd(scope.row, scope.index)">编辑</el-button>
                <el-button v-if="title === '入库'" type="primary" link @click="handleCopy(scope.row)">复制</el-button>
                <el-button type="danger" link @click="handleDelete(scope.row.id)">移除</el-button>
            </template>
        </LyxTable>

        <template #footer>
            <div class="chemicals-footer">
                <div class="footer__right" @click="handleConfirm(1)">
                    <img src="@/assets/img/icon_caogao@2x.png" alt="" />
                    保存为草稿
                </div>
                <div class="footer__left">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button v-if="rowData?.status === 1" type="primary" @click="handleConfirm(2)">重新提交</el-button>
                    <el-button v-else type="primary" @click="handleConfirm(2)">提交</el-button>
                </div>
           </div>
        </template>
    </el-dialog>

    <PhotoPreview v-model:visible="photoVisible" :urlList="imgUrlList" />

    <AddChemicals
        v-if="isAddItems"
        v-model:isAddItems="isAddItems"
        :editInfo="editInfo"
        @handle-add-submit="handleAddSubmit"
    />
    <CopyChemical
        v-if="isCopy"
        v-model:isCopy="isCopy"
        :copyData="copyData"
        @copy="handleUpdate"
    />
    <ChooseChemical
        v-if="isChooseList"
        v-model:isChooseList="isChooseList"
        @add-items="handleTable"
    />
    <ChemicalDetail
        v-if="isShowDetail"
        v-model:is-show-detail="isShowDetail"
        :rowId="rowId"
    />
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import { Plus } from "@element-plus/icons-vue";
import LyxTable from "@/components/LyxTable/index.vue";
import { deepClone } from "@/utils";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import PhotoPreview from "@/components/Dialog/PhotoPreview.vue";
import AddChemicals from "@/views/Chemicals/Storage/components/AddChemicals.vue";
import { listColumns, IFilterItem } from "@/views/Chemicals/Storage/props";
import CopyChemical from "@/views/Chemicals/Storage/components/CopyChemical.vue";
import ChooseChemical from "./ChooseChemical.vue";
import ChemicalDetail from "@/views/Chemicals/List/components/chemicalDetail.vue";

const props = defineProps({
    isShowAddList: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    },
    rowData: {
        type: Object,
        default: () => {}
    },
    filter: {
        type: Array as PropType<IFilterItem[]>,
        default: () => []
    }
});

const emit = defineEmits(["update:isShowAddList"]);

const handleClose = () => {
    emit("update:isShowAddList", false);
};

const formData = ref<any>([]);
if (props.filter) {
    formData.value = deepClone(props.filter);
}

const isAddItems = ref(false);
const editInfo = ref();
const editIndex = ref(0);
const handleAdd = (data, val) => {
    isAddItems.value = true;
    editInfo.value = data;
    editIndex.value = val;
};

// 新增
const handleAddSubmit = (data, val) => {
    isAddItems.value = false;

    if (val) {
        tableData.value[editIndex.value] = data;
    } else {
        tableData.value.unshift(data);
    }
};

// 添加
const isChooseList = ref(false);
const handleAddItem = () => {
    isChooseList.value = true;
};

const handleTable = (data) => {
    if (JSON.stringify(props.rowData) !== "{}" || tableData.value.length > 0) {
        tableData.value = data.concat(tableData.value);
    } else {
        tableData.value = data;
    }
};

// 复制
const isCopy = ref(false);
const copyData = ref();
const handleCopy = (data) => {
    isCopy.value = true;
    copyData.value = [data];
};

const handleUpdate = (data) => {
    isCopy.value = false;
    tableData.value = data.concat(tableData.value);
};

const handleConfirm = (val) => {
    const params = Object.assign({}, ...formData.value.map(item => (
        { [item.prop]: item.value }
    )));
    console.log(val, params);
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

// 存放位置
const warehouseList = ref<any>([]);

const handleDelete = (Id: string) => {
    ElMessageBox.confirm("是否确认移除该条数据?", "移除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        customClass: "delete-category"
    }).then(() => {
        tableData.value = tableData.value.filter(item => item.id !== Id);
    }).catch(() => { });
};

const isShowDetail = ref(false);
const rowId = ref("");
const handleName = (row) => {
    isShowDetail.value = true;
    rowId.value = row.id;
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
}

.el-form {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .itemNoWrap {
        width: 100%;
    }
}
.chemicals-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .footer__right {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #0057FE;
        cursor: pointer;
        >img {
            vertical-align: middle;
            width: 16px;
            height: 16px;
        }
    }
}

.table__title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        font-size: 16px;
        margin-right: 20px;
        color: #242B3A;
        font-family: HarmonyOS_Sans_SC_Bold;
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

.tip {
    margin: 16px 0;
    width: 100%;
    background: #fef6e7;
    align-items: center;
    padding: 12px;
    border: 1px solid #FBE0AD;
    border-radius: 4px;
    div {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #242B3A;
        line-height: 18px;
        display: flex;
        img {
            width: 16px;
            height: 16px;
            margin-right: 14px;
        }
    }
    p {
        margin-left: 28px;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242b3a;
    }
}

</style>
<style lang="scss">
.delete-category {
    position: relative;
    .el-message-box__header {
        .el-message-box__title {
            font-size: 16px;
            color: #242B3A;
            font-family: HarmonyOS_Sans_SC_Bold;
            margin-left: 35px;
            padding-top: 10px;
        }
    }
    .el-message-box__container {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A;
        .el-icon {
            position: absolute;
            top: -28px;
        }
    }
}
</style>
