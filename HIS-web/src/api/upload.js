import request from '@/utils/request'

export function policy(data) {
  return request({
    url: '/aliyun/oss/policy',
    method: 'get',
    data
  })
}

export function callback(data) {
  return request({
    url: '/aliyun/oss/callback',
    method: 'post',
    data
  })
} 

export function uploadResult(data) {
  return request({
    url: '/DmsMechanicItemRecord/uploadResult',
    method: 'post',
    params:data
  })
} 

