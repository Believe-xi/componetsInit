import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const menuRoutes: Array<RouteRecordRaw> = [
    {
        path: "home",
        name: "Home",
        meta: {
            title: "主页"
        },
        component: () => import("@/views/404.vue")
    },
    {
        path: "element",
        name: "element",
        meta: {
            title: "ElementUI"
        },
        component: () => import("@/views/ElementUI/index.vue"),
        children: [
            {
                path: "/element/custom-table",
                name: "custom-table",
                meta: {
                    title: "自定义表格"
                },
                component: () => import("@/views/ElementUI/moreLevelTable.vue")
            },
            // {
            //     path: "/element/welcome",
            //     name: "welcome",
            //     meta: {
            //         title: "欢迎"
            //     },
            //     component: () => import("@/components/TheWelcome.vue")
            // }
        ]
    }
];

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home",
        children: menuRoutes
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/404.vue")
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/home"
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
