import request from '@/utils/request'
// 查询报账员上一次报账的最后日期
export function queryRecentEndDatetime(data) {
  return request({
    url: '/dailySettlement/queryRecentEndDatetime',
    method: 'get',
    params: {
      cashierId:data
    }
  })
}
//查询发票信息
export function queryInvoiceInfo(data) {
  return request({
    url: '/invoice/queryInvoiceInfo',
    method: 'get',
    params: data
  })
}
//统计日结信息并日结
export function dailySettle(data) {
  return request({
    url: '/dailySettlement/dailySettle',
    method: 'get',
    params: data
  })
}

//根据日结记录id查询日结详细信息
export function querySettleDetailById(data) {
  return request({
    url: '/dailySettlement/querySettleDetailById',
    method: 'get',
    params: {
      id:data
    }
  })
}

//根据时间id查询日结历史
export function listDailySettleListRecord(data) {
  return request({
    url: '/dailySettlement/listDailySettleListRecord',
    method: 'get',
    params: data
  })
}

//根据日结id返回发票
export function queryInvoiceInfoBySettleId(data) {
  return request({
    url: '/invoice/queryInvoiceInfoBySettleId',
    method: 'get',
    params: {
      settleRecordId:data
    }
  })
}

//
export function verifySettle(data) {
  return request({
    url: '/dailySettlement/verifySettle',
    method: 'get',
    params: data
  })
}