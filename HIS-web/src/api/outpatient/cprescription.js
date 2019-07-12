import request from '@/utils/request'
export function apply(data) {
  return request({
    url: '/DmsHerbalPrescriptionRecord/apply',
    method: 'post',
    data
  })
}

export function listByReg(data) {
  return request({
    url: '/DmsHerbalPrescriptionRecord/listByReg',
    method: 'post',
    params:{
      registrationId:data
    }
  })
}

export function listByIds(data) {
  return request({
    url: '/DmsHerbalPrescriptionRecord/listByIds',
    method: 'post',
    params:{
      ids:data
    }
  })
}

export function invalid(data) {
  return request({
    url: '/DmsHerbalPrescriptionRecord/invalid',
    method: 'post',
    params:{
      ids:data
    }
  })
}