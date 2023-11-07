<template>
    <el-dialog
        :model-value="isChooseList"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="80%"
        style="min-width: 900px;min-height: 80vh;"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="chemicals__title">选择危化品</div>
        </template>

        <Filter :fields="chemicalFilter" :formState="formState" @search="search" />

        <LyxTable :tableData="tableData" :columns="listColumns" @selection="handleSelect">
            <template #assetsName="scope">
                <span class="lyx-asset__name" @click="handleName(scope.row)">
                    {{ scope.row.assetsName }}
                </span>
            </template>
            <template #assetsImg="scope">
                <el-button type="primary" link @click="handleView(scope.row.assetsImg)">查看</el-button>
            </template>
            <template #assetsExptime="scope">
                <span v-if="scope.row.assetsExptime">
                    {{ dayjs(scope.row.assetsExptime).format("YYYY-MM-DD") }}
                </span>
                <span v-else>--</span>
            </template>
        </LyxTable>

        <template #footer>
           <div class="new-add-footer">
                <div class="footer__right">
                    共{{ tableData.length }}项，已选<span>{{ selectList.length }}</span>项
                </div>
                <div class="footer__left">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                </div>
           </div>
        </template>
    </el-dialog>
    <ChemicalDetail
        v-if="isShowDetail"
        v-model:is-show-detail="isShowDetail"
        :rowId="rowId"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { IField } from "@/types/filter";
import { ITableColumn } from "@/types/table";
import Filter from "@/components/Filter/index.vue";
import LyxTable from "@/components/LyxTable/index.vue";
import { ElMessage } from "element-plus";
import ChemicalDetail from "@/views/Chemicals/List/components/chemicalDetail.vue";

defineProps({
    isChooseList: {
        type: Boolean,
        default: false,
        require: true
    }
});

const emit = defineEmits(["update:isChooseList", "addItems"]);

const handleClose = () => {
    emit("update:isChooseList", false);
};

let formState = {
    consumablesCode: "",
    consumablesName: "",
    consumablesTypeId: ""
};

const search = (state) => {
    formState = { ...formState, ...state };
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

const selectList = ref<any>([]);
const handleSelect = (data: any[]) => {
    selectList.value = data;
};

const handleConfirm = () => {
    handleClose();
    emit("addItems", selectList.value);
};

const isShowDetail = ref(false);
const rowId = ref("");
const handleName = (row) => {
    isShowDetail.value = true;
    rowId.value = row.id;
};

const tableData = ref([{
    id: "11",
    assetsCode: "22",
    assetsName: "22",
    brand: "111",
    assetsModel: "111",
    assetsExptime: "111",
    assetsImg: "",
    warehouseName: "111"
}]);

const chemicalFilter: IField[] = [
    {
        key: "consumablesCode",
        name: "危化品编码：",
        component: "input"
    },
    {
        key: "consumablesName",
        name: "危化品名称：",
        component: "input"
    },
    {
        key: "consumablesTypeId",
        name: "品目：",
        component: "selectTree"
        // IFunc: getTreeData
    }
];

const listColumns: ITableColumn[] = [
    {
        type: "selection",
        width: "55"
    },
    {
        prop: "assetsCode",
        label: "危化品编码",
        width: "150"
    },

    {
        prop: "assetsName",
        label: "危化品名称",
        width: "100",
        custom: true
    },

    {
        prop: "brand",
        label: "品牌",
        width: "120"
    },

    {
        prop: "assetsModel",
        label: "规格/型号",
        minWidth: "120"
    },

    {
        prop: "assetsExptime",
        label: "有效期到期日",
        minWidth: "120",
        custom: true
    },

    {
        prop: "assetsImg",
        label: "照片",
        minWidth: "120",
        custom: true
    },

    {
        prop: "warehouseName",
        label: "存放位置",
        minWidth: "120"
    }
];

</script>

<style lang="scss" scoped>
.chemicals__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}

.lyx-asset__name {
    cursor: pointer;
    color: var(--el-color-primary);
}
.new-add-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .footer__right {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A;

        >span {
            color: #0057FE;
        }
    }
}

</style>
