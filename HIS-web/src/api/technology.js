import request from '@/utils/request'
export function getMechlist(data) {
  return request({
    url: '/DmsMechanicItemRecord/listByDept',
    method: 'post',
    params:{
      deptId:data
    }
  })
}

export function log(data) {
  return request({
    url: '/DmsMechanicItemRecord/log',
    method: 'post',
    params:{
      itemRecordId:data.id,
      logStaffId:data.logStaffId
    }
  })
}

export function uploadResult(data) {
  return request({
    url: '/DmsMechanicItemRecord/uploadResult',
    method: 'post',
    params:{
      id:data.id,
      executeStaffId:data.executeStaffId,
      checkResult:data.checkResult,
      resultImgUrlList:data.resultImgUrlList
    }
  })
}