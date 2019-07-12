import request from '@/utils/request'

export function queryPersonal(data) {
  return request({
    url: '/workload/queryPersonal',
    method: 'post',
    params: data
  })
}

export function queryDeptPersonalWorkloadList(data) {
  return request({
    url: '/workload/queryDeptPersonalWorkloadList',
    method: 'post',
    params: data
  })
}