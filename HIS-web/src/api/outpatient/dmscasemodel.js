import request from '@/utils/request'
export function listModelCatTree(ownId,scope) {
  return request({
    url: '/DmsCaseModel/listModelCatTree',
    method: 'post',
    params: {
      ownId:ownId,
      scope:scope
    }
  })
}

export function createModel(data) {
  return request({
    url: '/DmsCaseModel/create',
    method: 'post',
    data
  })
}

export function deleteModel(data) {
  return request({
    url: '/DmsCaseModel/deleteModelOrCat',
    method: 'post',
    params:{
      id:data
    }
  })
}

export function updateModel(data) {
  return request({
    url: '/DmsCaseModel/updateModel',
    method: 'post',
    params:{
      modelId:data.modelId
    },
    data
  })
}

export function getModelDetail(data) {
  return request({
    url: '/DmsCaseModel/getModelDetail/'+data,
    method: 'get'
  })
}

export function getAllStaffModel(data) {
  return request({
    url: '/DmsCaseModel/getAllStaffModel',
    method: 'get',
    params:{
      staffId:data
    }
  })
}