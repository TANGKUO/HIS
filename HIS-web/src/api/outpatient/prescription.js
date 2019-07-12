import request from '@/utils/request'
export function apply(data) {
  return request({
    url: '/DmsMedicinePrescriptionRecord/apply',
    method: 'post',
    data
  })
}

export function listByReg(data) {
  return request({
    url: '/DmsMedicinePrescriptionRecord/listByReg',
    method: 'post',
    params:{
      registrationId:data
    }
  })
}

export function listByIds(data) {
  return request({
    url: '/DmsMedicinePrescriptionRecord/listByIds',
    method: 'post',
    params:{
      ids:data
    }
  })
}

export function invalid(data) {
  return request({
    url: '/DmsMedicinePrescriptionRecord/invalid',
    method: 'post',
    params:{
      ids:data
    }
  })
}