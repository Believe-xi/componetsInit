<template>
    <Teleport to="body">
        <div v-if="visible" class="view-img">
            <div class="view-img-wrapper">
                <img class="icon-close" src="@/assets/images/icon_close@2x.png" alt="" @click="handleClose" />
                <div class="view-img-content">
                    <img class="icon-arrow-left" src="@/assets/images/icon_arrow_left@2x.png" alt="" @click="handleArrow(0)" />
                    <img v-if="!imgUrl.length" class="current-img" src="@/assets/images/default.png" alt="" />
                    <img v-else class="current-img" :src="imgUrl[imgIndex]" alt="" />
                    <img class="icon-arrow-right" src="@/assets/images/icon_arrow_right@2x.png" alt="" @click="handleArrow(1)" />
                    <div v-if="imgUrl.length > 0" class="view-thumbnail-wrapper">
                        <div v-for="item,index in imgUrl" :key="index" class="thumbnail-img" :class="{active: imgIndex === index}" @click="handleChange(index)">
                            <img :src="item" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { watch, ref, PropType } from "vue";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    urlList: {
        type: Array as PropType<string[]>,
        default: () => []
    }
});
const emits = defineEmits(["update:visible"]);
const imgIndex = ref(0);
const imgUrl = ref<string[]>([]);
const handleClose = () => {
    emits("update:visible", false);
    imgIndex.value = 0;
    imgUrl.value = [];
};
const handleChange = (idx: number) => {
    imgIndex.value = idx;
};
const handleArrow = (type: number) => {
    if (type) {
        if (imgIndex.value === imgUrl.value.length - 1) return;
        imgIndex.value += 1;
    } else {
        if (imgIndex.value === 0) return;
        imgIndex.value -= 1;
    }
};
watch(
    () => props.urlList,
    e => {
        imgUrl.value = e;
    }, { immediate: true }
);
</script>

<style lang="scss" scoped>
.view-img {
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2999;
    background-color: rgba($color: #000000, $alpha: 0.2);
    overflow: auto;
    .view-img-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 42px;
            height: 42px;
            cursor: pointer;
        }
        .view-img-content {
            position: relative;
            height: 440px;
            width: 60%;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-arrow-left, .icon-arrow-right {
                width: 56px;
                height: 56px;
                margin: 0 15px;
                cursor: pointer;
            }
            .current-img {
                max-width: calc(100% - 142px);
                max-height: 100%;
                object-fit: contain;
                margin: auto;
            }
        }
        .view-thumbnail-wrapper {
            position: absolute;
            bottom: -144px;
            display: flex;
            justify-content: center;
            .thumbnail-img {
                width: 72px;
                height: 72px;
                border-radius: 6px;
                border: 2px solid #e5e6eb;
                margin-right: 12px;
                cursor: pointer;
                &>img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                &.active {
                    border: 2px solid #0057FE;
                }
            }
        }
    }
}
</style>
