/**
 * 商品模块的所有请求
 */

// 引入封装好的 request.js
import req from '@/utils/request'

/* 商品添加 */
export function goodsAdd(params) {
    return req.post('/goods/goodsadd',  params)
}

/* 商品表格数据 */ 
export function getDataByPage(params) {
    return req.get('/goods/goodslistbypage', params)
}

/* 高级查询 */ 
// export function searchGoods(params) {
//     return req.get('/goods/search', params)
// }

/* 加载后端数据 */ 
export function getSellData() {
    return req.get('/goods/selldata')
}