<template>
    <el-dialog :model-value="visible" :close-on-click-modal="false"
        class="lyx-dialog lyx-dialog-footer-padding lyx-dialog-height" width="60%"
        style="min-width: 900px;min-height: 80vh;" :before-close="handleClose">
        <template #header>
            <div class="title">{{ title }}</div>
        </template>
        <div class="info-list">
            <div v-for="item, index in info" :key="index" class="info-item">
                <span class="info-item-label">{{ item.label }}：</span>
                <span class="info-item-value">{{ item.value }}</span>
            </div>
            <img v-if="status === 3" class="examined-status" src="@/assets/images/examined_status@2x.png" alt="" />
        </div>
        <div class="header-title">{{ tableTitle }}</div>
        <slot></slot>
        <template #footer>
            <div class="bottom">
                <div class="bot-left">
                    <div v-if="isShowTips && title === '资产归还单审批' && [2, 4].includes(status)">
                        <img style="width: 16px;height: 16px; vertical-align: middle;" src="@/assets/images/icon_ts@2x.png" alt="">
                        <span>该单据通过后，损坏、缺失的资产将自动创建对应的资产报修单或处置单</span>
                    </div>
                </div>
                <div v-if="[2, 4].includes(status)" class="footer">
                    <div @click="handleSubmit(0)">驳回</div>
                    <div @click="handleSubmit(1)">通过</div>
                </div>
            </div>
        </template>
    </el-dialog>
    <ExaminedReject :visible="examinedRejectVisible" @confirm="onConfirm" />
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import ExaminedReject from "@/components/Dialog/ExaminedReject.vue";
defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: "资产入库单审批"
    },
    tableTitle: {
        type: String,
        default: "资产列表"
    },
    info: { // 基础信息
        type: Array as PropType<{ value: string, label: string }[]>,
        default: () => []
    },
    status: { // 底部按钮
        type: Number,
        default: 1
    },
    statuss: {
        type: Boolean,
        default: true
    },
    isShowTips: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(["confirm"]);
const examinedRejectVisible = ref(false);
const handleSubmit = async (type: number) => {
    if (type) {
        emits("confirm", 3);
    } else {
        examinedRejectVisible.value = true;
    }
};
const handleClose = () => {
    emits("confirm", -1);
};
const onConfirm = (flag: boolean, val: string) => {
    examinedRejectVisible.value = false;
    if (flag) {
        emits("confirm", 4, val);
    }
};
</script>

<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242b3a;
    font-weight: bold;
}

.info-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    font-family: HarmonyOS_Sans_SC;
    line-height: 24px;
    margin-top: 10px;
    position: relative;

    .info-item:not(:last-of-type) {
        margin-right: 60px;
    }

    .examined-status {
        position: absolute;
        top: -10px;
        right: 0;
        width: 81px;
        height: 71px;
    }
}

.info-item-label {
    color: #90949E;
}

.info-item-value {
    color: #242B3A;
}

.header-title {
    margin-top: 32px;
    margin-bottom: 18px;
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold;
    color: #242B3A;
    font-weight: bold;
}

.footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;

    div {
        width: 80px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
    }

    div:nth-of-type(1) {
        background: #F64949;
        border-radius: 4px;
        border: 1px solid #DBE1E7;
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #FFFFFF;
    }

    div:nth-of-type(2) {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #FFFFFF;
        background: #2FD7A2;
        margin-left: 12px;
    }
}

.bottom {
    display: flex;
    justify-content: space-between;
}

.bot-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;

    span {
        font-size: 14px;
        font-family: HarmonyOS_Sans_SC;
        color: #90949E;
        line-height: 18px;
        margin-left: 8px;
    }
}
</style>
