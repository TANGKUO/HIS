import request from '@/utils/request'

export function apply(data) {
  return request({
    url: '/nonDrugItemRecord/apply',
    method: 'post',
    data
  })
}

export function list(registrationId,type) {
  return request({
    url: '/nonDrugItemRecord/listByRegAndType',
    method: 'post',
    params:{
      registrationId:registrationId,
      type:type
    }, 
  })
}

export function invalid(data) {
  return request({
    url: '/nonDrugItemRecord/invalid',
    method: 'post',
    params:{
      ids:data
    }, 
  })
}


