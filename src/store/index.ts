import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";
import { stateProps, state } from "@/store/state";
import mutations from "@/store/mutations";
import { APP_ID } from "@/utils/config";

export const key: InjectionKey<Store<stateProps>> = Symbol("");

const dealForCodes = (menus: IMenuItem[], menuNames: Map<string, string>) => {
    let codes: string[] = [];
    for (const item of menus) {
        codes.push(item.code);
        menuNames.set(item.code, item.name);
        codes = codes.concat(dealForCodes(item.children, menuNames));
    }
    return codes;
};

const store = createStore<stateProps>({
    state,
    actions: {
        async getPermissions({ commit }) {
            const res = await getMenuAuthByUserID();
            let menus: IMenuItem[] = [];
            const menuNames = new Map<string, string>();
            if (res.success && res.resultCode === 200) {
                menus = res.result.find(item => item.appId === APP_ID)?.menus || [];
            }
            commit("updateMenuNames", menuNames);
            commit("updateMenuPermisions", dealForCodes(menus, menuNames));
        }
    },
    getters: { },
    mutations
});

export default store;

export const useStore = () => baseUseStore(key);
