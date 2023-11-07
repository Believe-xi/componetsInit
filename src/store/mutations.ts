import { stateProps } from "@/store/state";

const mutations = {
    setAddAssets(state: stateProps, data: boolean) {
        state.addAssets = data;
    },
    setAssetBorrow(state: stateProps, data: string) {
        state.assetBorrow = data;
    },
    setSelectRows(state: stateProps, data: []) {
        state.selectRows = data;
    },
    setAssetRepair(state: stateProps, data: boolean) {
        state.assetRepair = data;
    },
    setAssetDisposal(state: stateProps, data: boolean) {
        state.assetDisposal = data;
    },
    setConsumablesReceive(state: stateProps, data: boolean) {
        state.consumablesReceive = data;
    },
    setConsumablesStore(state: stateProps, data: boolean) {
        state.consumablesStore = data;
    },
    setConsumablesDisposal(state: stateProps, data: boolean) {
        state.consumablesDisposal = data;
    },
    setConsumablesList(state: stateProps, data: []) {
        state.consumablesList = data;
    },
    updateMenuPermisions(state: stateProps, data: string[]) {
        state.menuPermissions = data;
    },
    updateMenuNames(state: stateProps, data: Map<string, string>) {
        state.menuNamesMap = data;
    }
};

export default mutations;
