import request from '@/utils/request'
export function getPatientList(data) {
  return request({
    url: '/diagnosisPatient/refreshPatient',
    method: 'post',
    params: {
      staffId:data
    }
  })
}

export function bindPatient(registrationId,staffId) {
  return request({
    url: '/diagnosisPatient/bindPatient',
    method: 'get',
    params: {
      registrationId:registrationId,
      staffId:staffId
    }
  })
}

export function startDiagnosis(registrationId) {
  return request({
    url: '/diagnosisPatient/startDiagnosis',
    method: 'get',
    params: {
      registrationId:registrationId,
    }
  })
}
//读卡
export function selectPatientByIdNo(data) {
  return request({
    url: '/diagnosisPatient/selectPatientByIdNo',
    method: 'post',
    params: {
      identificationNo:data
    }
  })
}