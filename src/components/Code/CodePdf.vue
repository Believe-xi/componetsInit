<template>
    <div class="paf-main">
        <div ref="pdfRef" class="pdfRef">
            <div
                class="pdf-container"
                v-for="(page, index) in barcodeList"
                :key="index"
            >
                <div class="bar-code-list">
                    <div v-for="(text,index) in page" :key="index">
                        <div class="tag-box">
                            <div class="school-name tag-padding">
                                {{ headerName }}
                            </div>
                            <div class="tag-item" style="border-bottom: 1px solid #000;">
                                <div class="tag-label">名称</div>
                                <div class="tag-padding">
                                    {{ text.assetsName || text.consumablesName }}
                                </div>
                            </div>
                            <div class="tag-item">
                                <div class="tag-label">编号</div>
                                <div class="tag-padding tag-height">
                                    {{ text.assetsCode || text.consumablesCode }}
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div class="tag-item" style="flex-direction: column;">
                                    <div class="tag-label tag-border" v-if="!text.consumablesCode">
                                        日期
                                    </div>
                                    <div class="tag-label tag-border" v-if="!text.consumablesCode">位置</div>
                                </div>
                                <div style="flex: 1">
                                    <div class="tag-value tag-padding tag-height">
                                        <span v-if="text.assetsBuytime">{{ dayjs(text.assetsBuytime).format("YY-MM-DD") }}</span>
                                    </div>
                                    <div class="tag-value tag-padding tag-height tag-border">
                                        {{ text.warehouseName }}
                                    </div>
                                </div>
                                <div class="tag-code tag-padding tag-border">
                                    <qrcode-vue style="width: 35px;height: 35px;margin-top: 5px;" :value="text?.assetsCode" v-if="text.assetsCode"></qrcode-vue>
                                    <qrcode-vue style="width: 35px;height: 35px;margin-top: 5px;" :value="text.consumablesCode" v-if="text.consumablesCode"></qrcode-vue>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, nextTick, ref } from "vue";
import { jsPDF as JsPDF } from "jspdf";
import QrcodeVue from "qrcode.vue";
import "../../assets/HarmonyOS_Sans_SC/harmony-normal";
import { Local } from "@/utils/storage";

export default defineComponent({
    components: { QrcodeVue },
    setup() {
        const pdfRef = ref();
        const pdf = new JsPDF("p", "pt", "a4");
        pdf.setFont("HarmonyOS_Sans_SC_Medium");
        const _chunk = (arr: string[], num: number) => {
            let j = 0;
            let o = j;
            const newArray: string[][] = [];
            while (j < arr.length) {
                j += num;
                newArray.push(arr.slice(o, j));
                o = j;
            }
            return newArray;
        };
        const barcodeList = ref([]) as any;
        const openDialog = (arr) => {
            barcodeList.value = _chunk(arr, 10);
            nextTick(() => {
                pdf.html(pdfRef.value, {
                    callback: function(pdf) {
                        let pageCount = pdf.getNumberOfPages();
                        if (pageCount < 1) pageCount = 1;
                        while (pageCount > barcodeList.value.length) {
                            for (let i = barcodeList.value.length + 1; i <= pageCount; i++) {
                                pdf.deletePage(i);
                            }
                            pageCount = pdf.getNumberOfPages();
                        }
                        pdf.save("标签.pdf");
                    }
                });
            });
        };
        const headerName = Local.get("user_center.userInfo").OrgName;
        return {
            barcodeList,
            openDialog,
            pdfRef,
            headerName,
            dayjs
        };
    }
});
</script>

<style lang="scss" scoped>
.pdf-container {
    // width: 578.28px;
    width: 600px;
    height: 841.89px;
    box-shadow: 0 0 1px #ccc;
    padding: 10px;
    background-color: #fff;
    overflow: hidden;
}
.bar-code-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.bar-code-item {
    width: 49%;
    padding: 12px;
    height: 150px;
    box-sizing: border-box;
    margin-bottom: 16px;
    border: 1px solid #000;
    .code-header {
        text-align: center;
        font-size: 14px;
        color: #000000;
        margin-bottom: 12px;
        font-family: HarmonyOS_Sans_SC_Medium;
    }
    .code-content {
        display: flex;
        align-items: center;
        font-size: 12px;
        p {
            white-space: nowrap;
            margin: 0 0 0 15px;
            padding: 0;
            font-family: HarmonyOS_Sans_SC_Medium;
        }
    }
}
.el-dialog__body::-webkit-scrollbar {
    display: none !important;
}
.paf-main {
    width: 640px;
    display: none;
}

.tag-box {
    border: 1px solid #000;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #000000;
    font-size: 11px;
    margin-bottom: 10px;
    margin: 0 16px 16px 0;
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
</style>
