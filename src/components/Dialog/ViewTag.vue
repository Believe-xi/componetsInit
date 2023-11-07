<template>
    <el-dialog
        :model-value="isShowTag"
        :append-to-body="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :width="tagInfo.length > 1 ? '740px' : '500px'"
        @close="handleClose"
        class="tag-dialog lyx-dialog"
    >
        <template #title>
            <div class="tag__title">标签打印预览</div>
        </template>
        <div>
            <el-select v-model="printId" placeholder="请选择打印机">
                <el-option
                    v-for="option in printList"
                    :key="option.id"
                    :label="option.printerName"
                    :value="option.id"
                />
            </el-select>
        </div>
        <div class="tags" :style="{justifyContent: tagInfo.length > 1 ? 'flex-start' : 'center'}">
            <TagVue :tagInfo="tagInfo" :isShowImg="true"/>
        </div>
        <template #footer>
            <el-button type="primary" plain @click="handleDownload">下载</el-button>
            <el-button type="primary" @click="handlePrint">立即打印</el-button>
        </template>
    </el-dialog>
    <CodePdf ref="CodePdfRefs" />
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { Local } from "@/utils/storage";
import CodePdf from "@/components/Code/CodePdf.vue";
import { ElMessage } from "element-plus";
import { printLabel, getPrintList } from "@/api/printer";
import { IPrintList } from "@/views/Setting/Printer/props";
import TagVue from "@/components/Code/TagVue.vue";

interface ITagInfo {
    assetsName?: string;
    assetsCode?: string;
    assetsBuytime?: string;
    warehouseName?: string;
    consumablesCode?: string;
    consumablesName?: string;
    chemicalsCode?: string;
}

const props = defineProps({
    isShowTag: {
        type: Boolean,
        default: false
    },
    tagInfo: {
        type: Array as PropType<ITagInfo[]>,
        default: () => []
    }
});

const emit = defineEmits(["update:isShowTag"]);

const handleClose = () => {
    emit("update:isShowTag", false);
};

// 下载
const CodePdfRefs = ref();
const handleDownload = () => {
    CodePdfRefs.value.openDialog(props.tagInfo);
};

const printId = ref("");
const printList = ref<IPrintList[]>([]);
const getPrintData = async () => {
    const res = await getPrintList<IPrintList[]>({
        status: 0
    });
    if (res.resultCode !== 200) return;
    printList.value = res.result;
    printId.value = printList.value[0]?.id || "";
};
getPrintData();

// 打印
const handlePrint = () => {
    if (printList.value.length === 0) {
        ElMessage.error("未检测到专用打印设备, 请前往“基础设置/云打印管理”添加打印机");
    } else {
        printTag();
    }
};

const printTag = async () => {
    const params = props.tagInfo.map((item) => {
        return {
            code: item.assetsCode || item.consumablesCode || "",
            name: item.assetsName || item.consumablesName || "",
            position: item.warehouseName || "",
            time: (item.assetsBuytime)?.slice(2, 10) || "",
            schoolName: Local.get("user_center.userInfo").OrgName
        };
    });

    const SnCode = printList.value.find(item => item.id === printId.value)?.printerSn;

    const res = await printLabel({
        articleInfoDTOList: params,
        printerSn: SnCode
    });
    if (res.resultCode !== 200) return;
    ElMessage.success("打印成功");
};

</script>

<style lang="scss" scoped>
.tag__title {
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242B3A;
}
.tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 0;
}

</style>
