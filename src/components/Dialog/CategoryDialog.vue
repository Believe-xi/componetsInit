<template>
    <el-dialog
        :model-value="isShowDialog"
        :append-to-body="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="500px"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="category__title">{{ title }}品目</div>
        </template>
        <el-form :model="form" ref="formRef" :rules="rules">
            <el-form-item label="名称：" prop="assetsTypeName">
                <el-input
                    v-model="form.assetsTypeName"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="上级：" prop="parentId">
                <el-cascader
                    v-model="form.parentId"
                    :options="treeList"
                    :show-all-levels="false"
                    :props="{ children: 'childList', label: 'assetsTypeName', value: 'id', checkStrictly: true, emitPath: false }"
                    style="width: 100%"
                    @change="handleLevel"
                />
            </el-form-item>
            <el-form-item label="计量单位：" prop="unit">
                <el-input
                    v-model="form.unit"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="状态：" v-if="title == '编辑'" prop="state">
                <el-radio-group v-model="form.state">
                    <el-radio
                        v-for="(item, index) in statusList"
                        :key="index"
                        :label="item.Id"
                        @change="handleStatus(item.Id)"
                    >
                        {{ item.Name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="footer__btns">
                <div @click="handleDelete">
                    <el-button v-if="title == '编辑'" class="delete-btn" :icon="Delete" type="danger" text>
                        删除
                    </el-button>
                </div>
                <div>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { PropType, computed, ref, toRaw } from "vue";
import { statusList, IListData, IformProps } from "@/views/AssetManagement/Category/props";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addCategoty, removeCategory, updateCategoty } from "@/api/assetManagement";
import { toUTCDate } from "@/utils/dealData";

const props = defineProps({
    isShowDialog: {
        type: Boolean,
        default: false,
        require: true
    },
    editInfo: {
        type: Object,
        default: () => {}
    },
    treeList: {
        type: Array as PropType<IListData[]>,
        default: () => []
    },
    currentId: {
        type: String,
        default: ""
    }
});
const emit = defineEmits(["update:isShowDialog", "change"]);

const title = computed(() => props.editInfo ? "编辑" : "新增");

const form = ref<IformProps>({
    assetsTypeName: "",
    id: "",
    level: 0,
    state: 0,
    parentId: "",
    type: 2,
    unit: ""
});

if (props.editInfo) {
    const detail = toRaw(props.editInfo);
    form.value = { ...form.value, ...detail };
} else {
    if (props.currentId) {
        form.value.parentId = toRaw(props.currentId);
        form.value.level = findNodeById(props.treeList, form.value.parentId).level + 1;
    }
}

const handleClose = () => {
    emit("update:isShowDialog", false);
};

const formRef = ref();
const handleConfirm = () => {
    formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            if (props.editInfo) {
                const params: IformProps = {
                    assetsTypeName: form.value.assetsTypeName,
                    parentId: form.value.parentId,
                    level: form.value.level,
                    type: form.value.type,
                    state: form.value.state,
                    id: form.value.id,
                    unit: form.value.unit
                };
                updateCategoty({ ...params }).then(res => {
                    if (res.resultCode !== 200) return;
                    ElMessage.success("编辑成功");
                    handleClose();
                    emit("change", res.result);
                });
            } else {
                if (form.value.level > 10) {
                    ElMessage.error("层级不能超过10级");
                } else {
                    addCategoty({
                        ...form.value,
                        createTime: toUTCDate(new Date())
                    }).then(res => {
                        if (res.resultCode !== 200) return;
                        ElMessage.success("新增成功");
                        handleClose();
                        emit("change", form.value.parentId);
                    });
                }
            }
        }
    });
};

const handleStatus = (data: number) => {
    form.value.state = data;
};

const handleLevel = (val: string) => {
    form.value.parentId = val;
    form.value.level = findNodeById(props.treeList, val).level + 1;
};

function findNodeById(nodes, id) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
            return node;
        }
        if (node.childList && node.childList.length > 0) {
            const foundNode = findNodeById(node.childList, id);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
}

const handleDelete = () => {
    let desc = "是否确定删除该品目?";
    if (props.editInfo.childList?.length > 0) {
        desc = "该品目下有子品目,是否确定删除?";
    }
    ElMessageBox.confirm(desc, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        customClass: "delete-category"
    }).then(() => {
        removeCategory({ id: form.value.id }).then(res => {
            if (res.resultCode === 200) {
                ElMessage.success("删除成功");
                handleClose();
                emit("change", form.value.parentId);
            }
        });
    });
};

const rules = {
    assetsTypeName: [
        { required: true, message: "请输入名称", trigger: "blur" }
    ],
    parentId: [
        { required: true, message: "请输入上级", trigger: "blur" }
    ],
    state: [
        { required: true, message: "请选择状态", trigger: "blur" }
    ]
};

</script>

<style lang="scss" scoped>
.category__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}
.footer__btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-btn {
    padding-left: 0 !important;
}

.el-form {
    margin-top: 15px;
    :deep(.el-form-item__label) {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A !important;
        width: 100px;
        min-width: 100px;
    }
}

.el-radio {
    :deep(.el-radio__label) {
        color: #242B3A !important;
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
