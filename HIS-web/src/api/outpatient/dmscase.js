import request from '@/utils/request'
export function submitPriliminaryDise(data) {
  return request({
    url: '/caseHistory/submitPriliminaryDise',
    method: 'post',
    params: {
      chiefComplaint:data.chiefComplaint,//主述
      historyOfPresentIllness:data.historyOfPresentIllness,//现病史
      historyOfTreatment:data.historyOfTreatment,//现治疗情况
      pastHistory:data.pastHistory,//既往史
      allergies:data.allergies,//过敏史
      healthCheckup:data.healthCheckup,//体格检查
      registrationId:data.registrationId,//
      priliminaryDiseStrList:data.priliminaryDiseStrList,
      priliminaryDiseIdList:data.priliminaryDiseIdList,
      startDate:data.startDate,
      name:data.name,
      gender:data.gender,
      ageStr:data.ageStr
    }
  })
}


export function submitdefinite(data) {
  return request({
    url: '/caseHistory/submitDefiniteDise',
    method: 'post',
    params:data
  })
}
//诊毕
export function endDiagnosis(data) {
  return request({
    url: '/caseHistory/endDiagnosis',
    method: 'post',
    params:{
      registrationId:data
    }
  })
}
//根据挂号id获取已结束就诊的历史病历
export function selectEndCaseHistoryByReg(data) {
  return request({
    url: '/caseHistory/selectEndCaseHistoryByReg/'+data,
    method: 'get'
  })
}

//
export function getnonend(data) {
  return request({
    url: '/caseHistory/selectNotEndCaseHistoryByReg/'+data,
    method: 'get',
    params:{
      registrationId:data
    }
  })
}