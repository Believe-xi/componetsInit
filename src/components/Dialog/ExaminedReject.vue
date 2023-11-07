<template>
    <el-dialog
        :model-value="visible"
        :close-on-click-modal="false"
        class="lyx-dialog lyx-dialog-footer-padding"
        width="30%"
        :before-close="handleClose"
        title="驳回"
    >
        <el-input v-model="textarea" :autosize="{ minRows: 4 }" type="textarea" :maxlength="100" placeholder="请输入驳回原因"></el-input>
        <template #footer>
            <div class="footer">
                <div @click="handleClose">取消</div>
                <div @click="handleSubmit">确定</div>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref } from "vue";
defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(["confirm"]);
const textarea = ref("");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const handleSubmit = () => {
    if (!textarea.value) return ElMessage.warning("请输入驳回原因");
    emits("confirm", true, textarea.value);
    textarea.value = "";
};
const handleClose = () => {
    emits("confirm", false);
    textarea.value = "";
};
</script>

<style lang="scss" scoped>
.footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    div{
        width: 80px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
    }
    div:nth-of-type(1) {
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DBE1E7;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #242B3A;
    }
    div:nth-of-type(2) {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #FFFFFF;
        background: #0057FE;
        margin-left: 12px;
    }
}
</style>
