import request from '@/utils/request'
export function listPatient(data) {
  return request({
    url: '/drugStore/listPatient',
    method: 'post',
    params: data
  })
}

export function releaseDrug(data,type) {
  return request({
    url: '/drugStore/releaseDrug',
    method: 'post',
    params: {
      prescriptionId:data,
      type:type
    }
  })
}

export function refundDrug(data) {
  return request({
    url: '/drugStore/refundDrug',
    method: 'post',
    data
  })
}