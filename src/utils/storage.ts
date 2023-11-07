import { decrypt, encrypt } from "./crypto";
const PREFIX = "VUE";

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
    // 设置永久缓存
    set(key: string, val: any) {
        window.localStorage.setItem(key, JSON.stringify(val));
    },
    // 获取永久缓存
    get(key: string) {
        const json: any = window.localStorage.getItem(key);
        try {
            if (json) return JSON.parse(json);
            else return null;
        } catch (error) {
            console.log(error);
        }
    },
    // 移除永久缓存
    remove(key: string) {
        window.localStorage.removeItem(key);
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear();
    }
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
    // 设置临时缓存
    set(key: string, val: any) {
        window.sessionStorage.setItem(key, JSON.stringify(val));
    },
    // 获取临时缓存
    get(key: string) {
        const json: any = window.sessionStorage.getItem(key);
        try {
            if (json) return JSON.parse(json);
            else return null;
        } catch (error) {
            console.log(error);
        }
    },
    // 移除临时缓存
    remove(key: string) {
        window.sessionStorage.removeItem(key);
    },
    // 移除全部临时缓存
    clear() {
        window.sessionStorage.clear();
    }
};

export enum STORAGE_TYPES {
    // 储存token
    TOKEN = "TOKEN",

    // 用户信息
    USER_INFO = "USER_INFO",

    // 记录登录过得账号
    RECORD_LOGIN_LIST = "RECORD_LOGIN_LIST",

    // ossToken
    OSS_TOKEN = "OSS_TOKEN",

    OSS_PATHS = "OSS_PATHS",

    // ossToken 过期时间
    OSS_TOKEN_EXPIRETIME = "OSS_TOKEN_EXPIRETIME",

    // 云平台参数
    PARENT_APP_ID = "PARENT_APP_ID",
    PARENT_SYSTEM_ID = "PARENT_SYSTEM_ID",

    // 平台类型
    APP_ID = "APP_ID",
    APP_RULE = "APP_RULE",
    SYSTEM_ID = "SYSTEM_ID",
    PLATFORM_ID = "PLATFORM_ID",
    PLAT_TYPE = "PLAT_TYPE",

    SECRET_KEY = "SECRET_KEY",
    TERM_CODE = "TERM_CODE",

    USER_ID = "USER_ID",
    USER_NAME = "USER_NAME",
    ORG_ID = "ORG_ID",
    ORG_NAME = "ORG_NAME",
    ORG_TYPE_ID = "ORG_TYPE_ID",
    SCHOOL_ID = "SCHOOL_ID",
    MENU_ID = "MENU_ID",
    MENU_NAME = "MENU_NAME",
    APP_KEY = "APP_KEY",
    APP_SECRET = "APP_SECRET"
}

export const set = (
    name: STORAGE_TYPES | string,
    value: unknown,
    isEncrypt = false
) => {
    let newValue = typeof value === "string" ? value : JSON.stringify(value);
    newValue = isEncrypt ? encrypt(newValue) : newValue;
    localStorage.setItem(`${PREFIX}_${name}`, newValue);
};

export const get = (name: STORAGE_TYPES | string, isDecrypt = false) => {
    let item = localStorage.getItem(`${PREFIX}_${name}`);
    let result;
    try {
        item = isDecrypt ? decrypt(item || "") : item;
        result = item === null ? null : JSON.parse(item);
    } catch {
        result = item;
    }
    return result;
};

export const remove = (name: string) => {
    localStorage.removeItem(`${PREFIX}_${name}`);
};

export const getSSOParamUrl = (name: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === name) {
            return pair[1];
        }
    }
};

export const getUrlParam = (url: string, name: string) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (url.indexOf("?") > -1) {
        const r = url.split("?")[1].match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
    } else {
        return "";
    }
};
