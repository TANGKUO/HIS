import request from '@/utils/request'
//redis暂存

//暂存病历首页
export function saveCasePage(data) {
  return request({
    url: '/redisSave/saveCasePage',
    method: 'post',
    params:{
      registrationId:data.registrationId
    },
    data
  })
}

//取出病历首页
export function getCasePage(data) {
  return request({
    url: '/redisSave/getCasePage',
    method: 'post',
    params:{
      registrationId:data
    },
    data
  })
}

//暂存非药品项目
export function saveNonDrug(data) {
  return request({
    url: '/redisSave/saveNonDrug',
    method: 'post',
    params:{
      registrationId:data.registrationId,
      type:data.type
    },
    data
  })
}

//取出病历首页
export function getNonDrug(data) {
  return request({
    url: '/redisSave/getNonDrug',
    method: 'post',
    params:{
      registrationId:data.registrationId,
      type:data.type
    },
    data
  })
}

//暂存药方
export function saveDrugPrescription(data,registrationId,type) {
  return request({
    url: '/redisSave/saveDrugPrescription',
    method: 'post',
    params:{
      registrationId:registrationId,
      type:type
    },
    data
  })
}

//取出药方
export function getDrugPrescription(data) {
  return request({
    url: '/redisSave/getDrugPrescription',
    method: 'post',
    params:{
      registrationId:data.registrationId,
      type:data.type
    }
  })
}

