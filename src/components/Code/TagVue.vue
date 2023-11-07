<template>
    <div v-for="(item,index) in tagInfo" :key="index">
        <div class="tag-box" :style="tagInfo.length > 1 ? 'margin: 0 16px 16px 0;' : ''">
            <div class="school-name tag-padding">
                {{ Local.get("user_center.userInfo").OrgName }}
            </div>
            <div class="tag-item" style="border-bottom: 1px solid #000;">
                <div class="tag-label">名称</div>
                <div class="tag-padding">
                    {{ item.assetsName || item.consumablesName }}
                </div>
            </div>
            <div class="tag-item">
                <div class="tag-label">编号</div>
                <div class="tag-padding tag-height">
                    {{ item.assetsCode || item.consumablesCode }}
                </div>
            </div>
            <div style="display: flex;">
                <div class="tag-item" style="flex-direction: column;">
                    <div class="tag-label tag-border" v-if="!item.consumablesCode">
                        日期
                    </div>
                    <div class="tag-label tag-border" v-if="!item.consumablesCode">位置</div>
                </div>
                <div style="flex: 1">
                    <div class="tag-value tag-padding tag-height">
                        <span v-if="item.assetsBuytime">{{ dayjs(item.assetsBuytime).format("YY-MM-DD") }}</span>
                    </div>
                    <div class="tag-value tag-padding tag-height tag-border">
                        {{ item.warehouseName }}
                    </div>
                </div>
                <div class="tag-code tag-padding tag-border">
                    <qrcode-vue style="width: 35px;height: 35px;margin-top: 5px;" :value="item?.assetsCode" v-if="item.assetsCode"></qrcode-vue>
                    <qrcode-vue style="width: 35px;height: 35px;margin-top: 5px;" :value="item.consumablesCode" v-if="item.consumablesCode"></qrcode-vue>
                </div>
            </div>
        </div>
        <img v-if="!isShowImg" class="print-tag" src="@/assets/images/icon_print.png" alt="" @click="downloadTag"/>
    </div>
    <ViewTag v-model:is-show-tag="isShowTag" :tagInfo="tagInfo"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { Local } from "@/utils/storage";
import QrcodeVue from "qrcode.vue";
import ViewTag from "@/components/Dialog/ViewTag.vue";

defineProps({
    tagInfo: {
        type: Array as any,
        default: () => []
    },
    isShowImg: {
        type: Boolean,
        default: false
    }
});

const isShowTag = ref(false);
const downloadTag = () => {
    isShowTag.value = true;
};

</script>

<style lang="scss" scoped>
.tag-box {
    border: 1px solid #000;
    font-family: HarmonyOS_Sans_SC;
    color: #000000;
    font-size: 11px;
    margin-bottom: 5px;
    .tag-item {
        display: flex;
        line-height: 22px;
        height: 22px;
    }
    .tag-label {
        width: 34px;
        text-align: center;
        border-right: 1px solid #000;
    }
    .school-name {
        height: 22px;
        line-height: 22px;
        border-bottom: 1px solid #000;
        font-size: 12px;
        font-family: HarmonyOS_Sans_SC_Bold;
    }

    .tag-value {
        border-right: 1px solid #000;
        border-top: 1px solid #000;
    }
    .tag-code {
        width: 45px;
    }
    .tag-padding {
        padding: 0 5px;
    }
    .tag-height {
        height: 23px;
        line-height: 23px;
    }
    .tag-border {
        border-top: 1px solid #000;
    }
}

.print-tag {
    width: 75px;
    height: 18px;
    cursor: pointer;
}

</style>
