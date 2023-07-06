import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/el-message-box.css'

function messageBox(content: string, title = '') {
    let message = `
        <span class="messageBox-title">${title}</span>
        <span>${content}</span>
    `
    if (!title) {
        message = ` <span>${content}</span>`
    }
    return ElMessageBox.confirm(message, {
        dangerouslyUseHTMLString: true,
        showClose: false,
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
    })
}

export default messageBox
