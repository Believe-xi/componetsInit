export interface IResponse<T> {
    resultCode: number;
    result: T;
    success: boolean;
    resultDesc: string;
}
/* 分页出参 */
export interface IPaginationResponse<T> {
    [key: string]: unknown;
    list: T;
    endRow: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    navigateFirstPage: number;
    navigateLastPage: number;
    navigatePages: number;
    navigatepageNums: number[];
    nextPage: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    prePage: number;
    size: number;
    startRow: number;
    total: number;
}
// 仓库库存
export interface WarehouseConsumablesItem {
    consumablesId: string;
    id: string;
    number: number;
    warehouseId: string;
}
// 物资清单
export interface ConsumeInfoVOItem {
    applyNumber: number;
    assetsCode: string;
    assetsName: string;
    brand: string;
    consumablesCode: string;
    consumablesExptime: string;
    consumablesImg: string;
    consumablesModel: string;
    consumablesName: string;
    consumablesSn: string;
    consumablesUnit: string;
    examineId: string;
    id: string;
    number: number | null;
    realId: string;
    type: number;
    warehouseId: string;
    warehouseName: string;
    warehouseConsumablesList?: WarehouseConsumablesItem[];
}
// 查看耗材审批列表（入库，领用，调拨，处置与退还）出参
export interface ConsumeListOutDto {
    applicationNotes: string;
    approvalNo: string;
    approvalType: number;
    approvalTypeName: string;
    approveUserName: string;
    backTime: string;
    detailedList: string;
    consumablesDetailList: ConsumeInfoVOItem[];
    createName: string;
    createTime: string;
    detailedList: string;
    disposalType: number;
    disposalTypeName: string;
    id: string;
    inWarehouseId: string;
    inWarehouseName: string;
    outWarehouseId: string;
    outWarehouseName: string;
    status: number;
    statusName: string;
    templateId: string;
    templateName: string;
}
// 仓库地址
export interface WarehouseListOutDto {
    address: string;
    code: string;
    createBy: string;
    createTime: string;
    delFlag: number;
    id: string;
    name: string;
    orgId: string;
    platformId: string;
    state: string;
    updateBy: string;
    updateTime: string;
}
/* =============== */
// 耗材查看详情出参
export interface IbaseInfo {
    brand: string;
    consumablesCode: string;
    consumablesDesc: string;
    consumablesImg: string;
    consumablesModel: string;
    consumablesName: string;
    consumablesSn: string;
    consumablesTagImg: string;
    consumablesTypeCode: string;
    consumablesTypeId: string;
    consumablesTypeName: string;
    id: string;
}

export interface IUseInfo {
    approvalType: number;
    approvalTypeName: string;
    approveUserName: string;
    createTime: string;
    examineId: string;
    number: string;
}
export interface IDetailInfo {
    consumablesBasic: IbaseInfo;
    inventoryList: IUseInfo[];
}
// 耗材库存数据出参
export interface InventoryPageInfoOutDto {
    brand: string;
    code: string;
    consumablesCode: string;
    consumablesExptime: string;
    consumablesModel: string;
    consumablesName: string;
    consumablesSn: string;
    consumablesTagImg: string;
    consumablesTypeId: string;
    consumablesTypeName: string;
    consumablesUnit: string;
    id: string;
    number: number;
    safeQuantity: number;
    warehouseId: string;
    warehouseName: string;
}
// 耗材库存数据出参
export interface PendingCountOutDto {
    approvalType: number;
    pendingCount: number;
    status: number;
}
// 获取新增入库耗材列表-添加物料
export interface InventoryOnListOutDto {
    brand: string;
    consumablesCode: string;
    consumablesExptime: string;
    consumablesImg: string;
    consumablesModel: string;
    consumablesName: string;
    consumablesSn: string;
    consumablesUnit: string;
    id: string;
    warehouseConsumablesList: WarehouseConsumablesItem[];
}
