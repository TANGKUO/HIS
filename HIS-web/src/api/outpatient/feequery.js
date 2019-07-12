import request from '@/utils/request'
export function listByRegistration(data) {
  return request({
    url: '/feeQuery/listByRegistration',
    method: 'post',
    params:{
      registrationId: data
    }
  })
}
