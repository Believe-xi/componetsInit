import { Local, STORAGE_TYPES } from "@/utils/storage";
import { getCode } from "@/api/property";
// 定义日期格式化函数
export function formatDate(
    date: string | number | Date,
    format = "YYYY-MM-DD HH:mm:ss"
) {
    // 第二个参数为默认参数  也可传自己想要的格式
    const config = {
        YYYY: new Date(date).getFullYear(),
        MM: String(new Date(date).getMonth() + 1).padStart(2, "0"),
        DD: String(new Date(date).getDate()).padStart(2, "0"),
        HH: String(new Date(date).getHours()).padStart(2, "0"),
        mm: String(new Date(date).getMinutes()).padStart(2, "0"),
        ss: String(new Date(date).getSeconds()).padStart(2, "0")
    };
    // 替换掉格式
    for (const key in config) {
        format = format.replace(key, config[key]);
    }
    return format;
}
// 时差转换函数-UTC格式
export function toUTCDate(date: string | number | Date) {
    if (!date) return "";
    const time = +new Date(date);
    const offsetTime = new Date().getTimezoneOffset() * 60000;
    return new Date(time - offsetTime).toISOString();
}

// 定义周格式化函数
export function getCNDay(day: string | number) {
    const weekDays = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
    ];
    const dayOfWeek = weekDays[new Date(day).getDay()];
    return dayOfWeek;
}

// 生成id：ZCRK-时间戳-7位随机数
export function setApprovalNo(data: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const randomNum = Math.floor(Math.random() * 10000000); // 生成7位随机数
    return `${data}${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
}
export async function setCode(count: number, name: string, type: number, typeName: string) {
    const obj = {
        count, name, type, typeName, orgId: Local.get(STORAGE_TYPES.ORG_ID), platformId: Local.get(STORAGE_TYPES.PLATFORM_ID)
    };
    try {
        const res = await getCode(obj);
        return res.result[0].code;
    } catch (error) {
    }
}
// 导出文件
export function toDownFile(res: any, name: string) {
    const blob = new Blob([res], {
        type: "application/vnd.ms-excel;charset=utf-8"
    });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.setAttribute("href", objectUrl);
    if (name) {
        link.setAttribute("download", name);
    }
    link.click();
    window.URL.revokeObjectURL(link.href);
}
