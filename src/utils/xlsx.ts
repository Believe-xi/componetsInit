import * as XLSX from 'xlsx';


export const  xlsx = (json, fields, filename = '表格') =>  {//导出xlsx
    json.forEach(item => {
        for (let i in item) {
            if (fields[i]) {
                item[fields[i]] = item[i];
            }
            delete item[i]; //删除原先的对象属性
        }
    })
    let sheetName = filename //excel的文件名称
    let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
    let ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields) }) //将JS对象数组转换为工作表。
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
    const defaultCellStyle = { font: { name: "宋体", sz: 14, color: "FF00FF88" }, hpx: 40,  fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
    let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
    let wbout = XLSX.write(wb, wopts)
    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
    let a = document.createElement("a");
    a.href = url;
    a.download = filename + '.xlsx'
    a.click();
    // 释放这个临时的对象url
    window.URL.revokeObjectURL(url);
}

const s2ab = s => {
    var buf;
    if (typeof ArrayBuffer !== 'undefined') {
        buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        buf = new Array(s.length);
        for (var j = 0; j != s.length; ++j) buf[j] = s.charCodeAt(j) & 0xFF;
        return buf;
    }
}