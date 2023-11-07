<template>
    <el-dialog
        :model-value="isShowScanData"
        :append-to-body="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="1050px"
        style="min-height: 60vh;"
        @close="handleClose"
        class="lyx-dialog"
    >
        <template #header>
            <div class="inventory__title">请确认实物是否与数据一致</div>
        </template>
        <div class="detail__item" style="width: 100%;">
            <span>资产类目</span>
            <span>{{ categoryPath }}</span>
        </div>
        <div class="detail__list">
            <div class="detail__item">
                <span>物资编码</span><span>{{ assetInfo?.assetsCode }}</span>
            </div>
            <div class="detail__item">
                <span>资产名称</span><span>{{ assetInfo?.assetsName }}</span>
            </div>
            <div class="detail__item">
                <span>品牌</span><span>{{ assetInfo?.brand }}</span>
            </div>
            <div class="detail__item">
                <span>型号</span><span>{{ assetInfo?.assetsModel }}</span>
            </div>
            <div class="detail__item">
                <span>入库时间</span>
                <span v-if="assetInfo?.assetsBuytime">{{ dayjs(assetInfo?.assetsBuytime).format("YYYY-MM-DD") }}</span>
            </div>
            <div class="detail__item">
                <span>有效期到期日</span>
                <span v-if="assetInfo?.assetsExptime">{{ dayjs(assetInfo?.assetsExptime).format("YYYY-MM-DD") }}</span>
            </div>
        </div>
        <div class="detail__item" style="width: 100%;">
            <span>备注</span>
            <span>{{ assetInfo?.assetsDesc }}</span>
        </div>
        <div class="detail__list" style="flex-wrap: wrap;">
            <div style="margin-right: 60px;">
                <span class="list__name">照片</span>
                <div v-if="imgUrls.length > 0" style="display: flex; flex-wrap: wrap;">
                    <div class="asset-pic" v-for="item,index in imgUrls" :key="index">
                        <img :src="item.url" alt="" />
                        <img class="pic-download" src="@/assets/images/icon_download@2x.png" @click="downloadImg(item.url)" alt="" />
                    </div>
                </div>
                <div v-else>
                    <img class="default-img" src="@/assets/images/default.png" alt="">
                </div>
            </div>
            <div>
                <span class="list__name">标签</span>
                <TagVue :tagInfo="[tagInfo]" />
            </div>
        </div>
        <div class="inventory__result">
            <div>盘点结果</div>
            <el-radio-group v-model="inventoryStatus">
                <el-radio label="1" size="large">正常</el-radio>
                <el-radio label="2" size="large">损坏</el-radio>
            </el-radio-group>
        </div>
        <template #footer>
            <div class="inventory__footer">
                <el-button type="primary" @click="handleNext">下一个</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import dayjs from "dayjs";
import { Local } from "@/utils/storage";
import { getAssetInfo, getCategoryTree } from "@/api/assetManagement";
import { IbaseInfo } from "@/views/AssetManagement/List/props";
import { IListData } from "@/views/AssetManagement/Category/props";
import { updateCheckDetail } from "@/api/property";
import { ElMessage } from "element-plus";
import TagVue from "@/components/Code/TagVue.vue";

const props = defineProps({
    isShowScanData: {
        type: Boolean,
        default: false
    },
    assetId: {
        type: String,
        default: ""
    },
    inventoryId: {
        type: String,
        default: ""
    }
});

const emit = defineEmits(["update:isShowScanData", "next"]);

const handleClose = () => {
    emit("update:isShowScanData", false);
};

const categoryPath = ref("");
const assetInfo = ref<IbaseInfo>();
const imgUrls = ref<{ uid:string, url:string }[]>([]);

const getInfo = async (Id) => {
    const res = await getAssetInfo<IbaseInfo>({
        id: Id
    });
    if (res.resultCode !== 200) return;
    assetInfo.value = res.result;
    if (res.result.assetsImg) {
        const Imgs: any = [];
        res.result.assetsImg.split(",").forEach((img) => {
            const imageObj = {
                uid: img.split("|")[1],
                url: img.split("|")[0]
            };
            Imgs.push(imageObj);
        });
        imgUrls.value = Imgs;
    }
    categoryPath.value = getItemByIdInTree(treeList, res.result.assetsTypeId);
    tagInfo.value.assetsName = res.result.assetsName;
    tagInfo.value.assetsCode = res.result.assetsCode;
    tagInfo.value.assetsBuytime = res.result.assetsBuytime;
    tagInfo.value.warehouseName = res.result.warehouseName;
};

watch(() => props.assetId, (value) => {
    if (value) {
        getTreeData();
        getInfo(value);
    }
}, {
    deep: true,
    immediate: true
});

// 确认下一个
const handleNext = () => {
    check();
};

const inventoryStatus = ref("1");

// 盘点
const check = async () => {
    const res = await updateCheckDetail({
        assetsStatus: inventoryStatus.value,
        checkFlag: "1",
        checkTime: new Date(),
        id: props.inventoryId,
        checkUserId: Local.get("USER_ID"),
        checkUserName: Local.get("USER_NAME")
    });
    if (res.resultCode !== 200) return;
    ElMessage.success("盘点成功");
    emit("next");
};

// 树
const treeList = ref<IListData[]>();
const getTreeData = async () => {
    const res = await getCategoryTree<IListData[]>();
    if (res.resultCode !== 200) return;
    treeList.value = res.result;
};

// 下载图片
const downloadImg = (item) => {
    const fileName = item;
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.setAttribute("crossOrigin", "Anonymous");
    img.src = item;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context?.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d")?.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
            const link = document.createElement("a");
            if (blob) {
                link.href = window.URL.createObjectURL(blob);
            }
            link.download = fileName;
            link.click();
        });
    };
};

// 下载标签
const tagInfo = ref({
    assetsName: "",
    assetsCode: "",
    assetsBuytime: "",
    warehouseName: ""
});

function getItemByIdInTree(tree, value, path = "") {
    for (let i = 0; i < tree.length; i++) {
        let tempPath = path;
        tempPath = `${tempPath ? tempPath + " / " : tempPath}${tree[i].assetsTypeName + " - " + tree[i].code}`;
        if (tree[i].id === value) {
            return tempPath;
        } else if (tree[i].childList) {
            const reuslt = getItemByIdInTree(tree[i].childList, value, tempPath);
            if (reuslt) {
                return reuslt;
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.inventory__title {
    font-size: 20px;
    color: #242B3A;
    font-family: HarmonyOS_Sans_SC_Bold;
}
.detail__list {
    display: flex;
}
.detail__item {
    min-width: 160px;
    width: 20%;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    font-size: 14px;
    font-family: HarmonyOS_Sans_SC;
    color: #242B3A;

    span:nth-of-type(1) {
        color: #90949E;
    }
}

.default-img {
    width: 160px;
    height: 90px;
}

.asset-pic {
    position: relative;
    margin: 0 10px 25px 0;
    .pic-download {
        position: absolute;
        bottom: -23px;
        left: 0;
        width: 76px;
        height: 18px;
        cursor: pointer;
    }

    img {
        width: 160px;
        height: 90px;
    }
}

.list__name {
    font-size: 14px;
    font-family: HarmonyOS_Sans_SC;
    color: #90949E;
    line-height: 26px;
}

.inventory__result {
    padding-top: 24px;
    margin-top: 24px;
    border-top: 1px solid #E5E5E5;
    div:nth-of-type(1) {
        font-size: 16px;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #242B3A;
        margin-bottom: 10px;
    }
}

.inventory__footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #E5E5E5;
    padding-top: 16px;
}

</style>
