/**
 * 账号管理模块相关的请求
 */

// 引入封装好的 request.js
import req from '@/utils/request'

/* 账号添加 */
export function accountAdd(params) {
    return req.post('/account/accountadd',  params)
}

/* 批量删除 */
export function batchDelete(params) {
    return req.get('/account/batchdelete',  params)
}

/* 编辑 */
export function accountEdit(params) {
    return  req.get('/account/accountedit',  params)
}

/* 保存编辑 */
export function saveEdit(params) {
    return  req.post('/account/saveedit', params)
}

/* 单条删除 */
export function accountDel(params) {
    return  req.get('/account/accountdel', params )
}

/* 分页请求 */
export function getDataByPage(params) {
    return  req.get('/account/accountlistbypage', params)
}


/* 验证旧密码是否正确 */
export function checkOldPass(params) {
   return req.post('/account/checkoldpass', params)
}

/* 修改密码 */ 
export function passwordModify(params) {
    return req.post('/account/passwordmodify', params)
}

/* 获取当前登录的用户信息 */
export function getInfo () {
    return  req.get('/account/info')
}

/* 菜单权限 */
export function getRole () {
    return  req.get('/account/role')
}





