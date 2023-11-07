export interface ISelectOption {
    label: string;
    value: string | number | null;
}

export interface IField {
    key: string;
    name: string;
    component: string;
    placeholder?: string;
    data?: ISelectOption[];
    props?: { [key: string]: unknown };
    row?: number;
    func?: () => Promise;
    deal?: (result: T) => ISelectOption[];
    IFunc?: () => Promise;
}

export interface IFormState {
    [key: string]: string | number | [string, string];
}
