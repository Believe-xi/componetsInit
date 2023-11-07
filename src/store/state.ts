export interface stateProps {
    addAssets: boolean;
    assetBorrow: string;
    selectRows: [];
    assetRepair: boolean;
    assetDisposal: boolean;
    consumablesReceive: boolean;
    consumablesStore: boolean;
    consumablesDisposal: boolean;
    consumablesList: [];
    menuPermissions: string[];
    menuNamesMap: Map<string, string>;
}

export const state: stateProps = {
    addAssets: false,
    assetBorrow: "",
    selectRows: [],
    assetRepair: false,
    assetDisposal: false,
    consumablesReceive: false,
    consumablesStore: false,
    consumablesDisposal: false,
    consumablesList: [],
    menuPermissions: [],
    menuNamesMap: new Map<string, string>()
};

export default state;
