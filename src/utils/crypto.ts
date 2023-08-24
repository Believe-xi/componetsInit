import CryptoJS from "crypto-js";

const key = "KEYLEYIXUEADMIN20200120";

const iv = CryptoJS.enc.Hex.parse("IVLEYIXUESECURET20200120");

// 加密
export const encrypt = (data: string) => {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};

// 解密
export const decrypt = (data: string) => {
    const decrypted = CryptoJS.AES.decrypt(data, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
