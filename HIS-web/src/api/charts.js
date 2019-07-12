import request from '@/utils/request'
// 查询个人七日接诊人数
export function staffPatients(data) {
  return request({
    url: '/charts/staffPatients',
    method: 'get',
    params: {
      staffId:data
    }
  })
}
// 查询科室七日接诊人数
export function deptPatients(data) {
  return request({
    url: '/charts/deptPatients',
    method: 'get',
    params: {
      deptId:data
    }
  })
}
// 查询科室七日分类收费
export function deptClassifyStatistics(data) {
  return request({
    url: '/charts/deptClassifyStatistics',
    method: 'get',
    params: {
      deptId:data
    }
  })
}
// 查询全院七日接诊人数
export function totalPatients() {
  return request({
    url: '/charts/totalPatients',
    method: 'get'
  })
}
// 查询个人七日分类费用
export function staffClassifyStatistics(data) {
  return request({
    url: '/charts/staffClassifyStatistics',
    method: 'get',
    params:{
      staffId:data
    }
  })
}