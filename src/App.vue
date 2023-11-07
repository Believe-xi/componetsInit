<template>
    <div class="lyx-asset__container">
        <Sidebar />
        <div class="lyx-asset-layout">
            <div class="lyx-asset__scroll">
                <div class="lyx-asset__content" :style="route.name === 'Home' ? '' : 'padding: 20px'">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Sidebar from "@/components/Sidebar/index.vue";
import { useRoute } from "vue-router";

const route = useRoute();

</script>

<style lang="scss" scoped>
.lyx-asset__container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    background-color: #fff;
    z-index: 1;
}

.lyx-asset-layout {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.lyx-asset__header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 10px 20px;
    line-height: 30px;
    color: #90949E;
    background-color: #EFF2F5;
}

.lyx-asset__scroll {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
}

.lyx-asset__content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    min-width: 980px;
    // background: rgba(239, 242, 245, 1);
}
</style>

<style>
.lyx-asset__header span {
    color: #444;
}
</style>
