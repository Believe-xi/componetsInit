<template>
    <el-dialog
        :model-value="isShowAddItems"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="70%"
        style="min-width: 900px;min-height: 80vh;"
        @close="handleClose"
        class="lyx-dialog new-add-dialog"
    >
        <template #header>
            <div class="new-add__title">{{ title }}资产</div>
        </template>
        <el-form ref="ruleFormRef" :model="form" label-position="right" :rules="rules">
            <el-form-item label="资产类目：" prop="assetsTypeName">
                <el-input
                    v-model="form.assetsTypeName"
                    style="width: calc(100% - 70px);"
                />
                <el-button
                    type="primary"
                    @click="handleChoose"
                    style="margin-left: 10px;"
                >
                    {{ title === "新增" ? "选择" : "更换"}}
                </el-button>
            </el-form-item>
            <el-form-item label="资产名称：" prop="assetsName">
                <el-input
                    v-model="form.assetsName"
                    :minlength="2"
                    show-word-limit
                    @change="conditionChange(form.assetsName, 2)"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="物资编码：" prop="assetsCode">
                <el-input
                    v-model="form.assetsCode"
                    placeholder="根据品目和名称自动生成"
                    disabled
                />
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
                <el-input
                    v-model="form.brand"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="型号：" prop="assetsModel">
                <el-input
                    v-model="form.assetsModel"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="有效期到期日：" prop="assetsExptime">
                <el-date-picker
                    v-model="form.assetsExptime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择"
                    style="width: 100%"
                />
            </el-form-item>
            <!-- <el-form-item label="计量单位：" prop="assetsUnit">
                <el-input
                    v-model="form.assetsUnit"
                    placeholder="请输入"
                />
            </el-form-item> -->
            <el-form-item label="存放位置：" prop="warehouseId">
                <el-select v-model="form.warehouseId" style="width: 100%">
                    <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" class="item-noWrap" prop="assetsDesc">
                <el-input
                    :autosize="{ minRows: 3 }"
                    v-model="form.assetsDesc"
                    :maxlength="800"
                    type="textarea"
                    resize="none"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="上传照片：" class="item-noWrap">
                <el-upload
                    :file-list="fileList"
                    action=""
                    list-type="picture-card"
                    :http-request="hadleUploadFile"
                >
                    <el-icon><Plus /></el-icon>
                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <el-icon><Delete /></el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-dialog>

    <ChooseCategory
        v-if="isChoose"
        v-model:isChoose="isChoose"
        :categoryType="1"
        @category="handleCategory"
    />
</template>

<script setup lang="ts">
import { PropType, ref, toRaw, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { getCategoryTree } from "@/api/assetManagement";
import { IListData } from "@/views/AssetManagement/Category/props";
import { toUTCDate } from "@/utils/dealData";
import { Local, STORAGE_TYPES } from "@/utils/storage";
import { qiNiuFileUpload } from "@/api/common";
import { getCode } from "@/api/property";
import ChooseCategory from "./ChooseCategory.vue";

const props = defineProps({
    isShowAddItems: {
        type: Boolean,
        default: false,
        require: true
    },
    editInfo: {
        type: Object,
        default: () => {}
    },
    warehouseList: {
        type: Array as PropType<any>,
        default: () => []
    }
});

const emit = defineEmits(["update:isShowAddItems", "handleAddSubmit"]);

const form = ref({
    assetsTypeCode: "",
    assetsTypeId: "",
    assetsTypeName: "",
    assetsName: "",
    assetsCode: "",
    brand: "",
    assetsModel: "",
    assetsExptime: "",
    warehouseId: "",
    assetsUnit: "",
    assetsDesc: "",
    assetsImg: "",
    platformId: Local.get(STORAGE_TYPES.PLATFORM_ID),
    orgId: Local.get(STORAGE_TYPES.ORG_ID),
    assetsBuytime: toUTCDate(new Date())
});

const title = ref("新增");
const ruleFormRef = ref();
// 上传照片
const fileList = ref<{uid:string, url:string}[]>([]);
const hadleUploadFile = async (files) => {
    const formData = new FormData();
    formData.append("files", files.file);
    qiNiuFileUpload<any>(formData as any).then(res => {
        if (res.resultCode === 200) {
            fileList.value.push({ uid: files.file.uid, url: res.result.absoluteUrl });
            ElMessage.success("添加成功");
        } else {
            ElMessage.error("添加失败，请删除后重新添加");
        }
    }).catch(err => {
        console.log(err);
        ElMessage.error("添加失败，请删除后重新添加");
    });
};
const handleRemove = (file) => {
    const newFiles = fileList.value.filter(i => i.uid !== file.uid);
    fileList.value = JSON.parse(JSON.stringify(newFiles));
};
watch(() => props.editInfo, (value) => {
    if (value.assetsTypeId) {
        title.value = "编辑";
        const list = JSON.parse(JSON.stringify(value.assetsImg)).split(",");
        fileList.value = list?.map(i => {
            return { uid: i.split("|")[1], url: i.split("|")[0] };
        });
        form.value = { ...form.value, ...toRaw(value) };
        form.value.assetsTypeId = form.value.assetsTypeId + "|" + form.value.assetsTypeCode;
    } else {
        title.value = "新增";
    }
}, { immediate: true });
const handleClose = () => {
    // ruleFormRef.value.resetFields();
    emit("update:isShowAddItems", false);
};
const typeId = ref();
const conditionChange = async (val, num) => {
    if (num === 2) {
        if (val.length < 2) {
            ElMessage.warning("请输入至少两个字符");
            return;
        } else {
            typeId.value = form.value.assetsTypeId;
        }
    } else if (num === 1) {
        typeId.value = val;
    }
    if (title.value === "编辑") return;
    form.value.assetsCode = await _getCode(typeId.value);
};

const searchName = (data: Array<IListData>, id: string) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node.id === id) {
            return node;
        }
        if (node.childList && node.childList.length > 0) {
            const foundNode = searchName(node.childList, id);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
};

const _getCode = async (val) => {
    const params = {
        count: null,
        name: form.value.assetsName,
        orgId: Local.get("ORG_ID"),
        platformId: Local.get("PLATFORM_ID"),
        type: 0,
        typeName: searchName(treeList.value, val)?.assetsTypeName
    };
    if (params.name && params.typeName) {
        const res = await getCode(params);
        if (res.resultCode === 200) {
            return res.result[0].code;
        }
    }
};

const handleConfirm = () => {
    ruleFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            const list = JSON.parse(JSON.stringify(fileList.value)).map(i => i.url + "|" + i.uid).join(",");
            const data = {
                ...form.value,
                assetsImg: list,
                assetsExptime: toUTCDate(form.value.assetsExptime),
                assetsTypeId: form.value.assetsTypeId.split("|")[0],
                assetsTypeCode: form.value.assetsTypeId.split("|")[1],
                assetsTypeName: form.value.assetsTypeName
            };
            if (title.value === "新增") {
                emit("handleAddSubmit", data, 0);
            } else {
                emit("handleAddSubmit", data, 1);
            }
            // ruleFormRef.value.resetFields();
        }
    });
};
// 树
const treeList = ref<IListData[]>([]);
const getTreeData = async () => {
    const res = await getCategoryTree<IListData[]>();
    if (res.resultCode !== 200) return;
    dealTree(res.result);
    treeList.value = res.result;
};
const dealTree = (list: any[]) => {
    for (const item of list) {
        item.id = item.id + "|" + item.code;
        if (item.childList?.length) {
            dealTree(item.childList);
        }
    }
};
getTreeData();
const rules = {
    assetsTypeName: [
        { required: true, message: "请选择资产类目", trigger: "blur" }
    ],
    assetsName: [
        { required: true, message: "请输入名称", trigger: "blur" }
    ],
    // brand: [
    //     { required: true, message: "请输入品牌", trigger: "blur" }
    // ],
    // assetsModel: [
    //     { required: true, message: "请输入型号", trigger: "blur" }
    // ],
    // assetsExptime: [
    //     { required: true, message: "请选择使用期限", trigger: "blur" }
    // ],
    warehouseId: [
        { required: true, message: "请输入存放点", trigger: "blur" }
    ]
    // assetsUnit: [
    //     { required: true, message: "请输入计量单位", trigger: "blur" }
    // ]
};

// 选择品目
const isChoose = ref(false);
const handleChoose = () => {
    isChoose.value = true;
};

const handleCategory = (data) => {
    isChoose.value = false;
    form.value.assetsTypeId = data.id + "|" + data.code;
    form.value.assetsTypeName = data.assetsTypeName;
    conditionChange(data.id, 1);
};

</script>

<style lang="scss" scoped>
.new-add__title {
    font-size: 16px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}
.el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    .el-form-item {
        width: 48%;
        margin-bottom: 24px !important;

        :deep(.el-form-item__label) {
            width: 130px !important;
            min-width: 130px;
            padding-bottom: 8px;
            word-break: break-all;
            word-wrap: break-word;
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC;
            color: #242B3A;
        }
    }
    .item-noWrap {
        width: 100%;
    }
}

</style>
<style lang="scss">
.new-add-dialog {
    .el-dialog__body {
        padding: 10px 24px 15px !important;
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px;
        background-color: #ffffff;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #cbcbcb;
        cursor: pointer;
    }
    :deep(.el-upload-list__item-status-label){
        display: none !important;
    }
}
</style>
