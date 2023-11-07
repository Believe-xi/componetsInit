<template>
    <el-dialog
        :model-value="isChoose"
        @close="handleClose"
        class="lyx-dialog"
        width="600px"
        style="min-height: 80vh;"
    >
        <template #header>
            <div class="category__title">选择品目</div>
            <el-input
                :prefix-icon="Search"
                v-model="keyword"
                placeholder="输入关键字搜索"
                style="width: 50%; margin-top: 20px;"
                clearable
            />
        </template>

        <div class="category__tree">
            <el-tree
                ref="treeRef"
                node-key="id"
                empty-text="暂无数据"
                :data="treeData"
                :highlight-current="true"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :props="treeProps"
                @node-click="handleClickNode"
            />
        </div>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getCategoryTree } from "@/api/assetManagement";
import { getConsumablesTree } from "@/api/consume";
import { ElMessage } from "element-plus";

const props = defineProps({
    isChoose: {
        type: Boolean,
        default: false
    },
    categoryType: {
        type: Number,
        default: 1
    }
});

const emit = defineEmits(["update:isChoose", "category"]);
const handleClose = () => {
    emit("update:isChoose", false);
};

const keyword = ref("");
const treeData = ref<any>([]);
const treeRef = ref();

const filterNode = (value: string, data: any) => {
    if (!value) return true;
    return data.assetsTypeName.includes(value);
};

watch(() => keyword.value, (val) => {
    treeRef.value!.filter(val);
});

const getAsset = async () => {
    const res = await getCategoryTree<any>();
    if (res.resultCode !== 200) return;
    treeData.value = res.result;
};

const getConsume = async () => {
    const res = await getConsumablesTree<any>();
    if (res.resultCode !== 200) return;
    treeData.value = res.result;
};

const treeProps = ref({
    children: "",
    label: ""
});

if (props.categoryType) {
    if (props.categoryType === 1) {
        treeProps.value.children = "childList";
        treeProps.value.label = "assetsTypeName";
        getAsset();
    } else {
        treeProps.value.children = "consumablesList";
        treeProps.value.label = "consumablesTypeName";
        getConsume();
    }
}

const categoryInfo = ref();

const handleClickNode = (data) => {
    categoryInfo.value = data;
};

const handleConfirm = () => {
    if (!categoryInfo.value.childList && !categoryInfo.value.consumablesList) {
        emit("category", categoryInfo.value);
    } else {
        ElMessage.error("请选择最末级的品目");
    }
};

</script>

<style lang="scss" scoped>
.category__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}
.category__tree {
    overflow: auto;
}

</style>
