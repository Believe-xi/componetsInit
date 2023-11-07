<template>
    <img class="lyx-bar-code" ref="barcode" />
</template>

<script lang="ts" setup>
import JsBarcode from "jsbarcode";
import { nextTick, ref } from "vue";

const props = defineProps({
    text: {
        type: String,
        default: ""
    }
});

const barcode = ref();
nextTick(() => {
    JsBarcode(barcode.value, props.text, {
        textAlign: "left",
        fontSize: 30,
        lineColor: "#000"
    });
});
</script>

<style scoped lang="scss">
.lyx-bar-code {
    max-width: 100%;
    max-height: 100%;
}
</style>
