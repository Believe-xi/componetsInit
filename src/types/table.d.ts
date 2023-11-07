export interface ITableColumn {
    [key: string]: unknown;
    type?: string;
    prop?: string;
    label?: string;
    width?: string;
    custom?: boolean;
    fixed?: "left" | "right" | "top";
}

export interface IPagination {
    [key: string]: unknown;
    total: number;
    current: number;
    size: number;
}
