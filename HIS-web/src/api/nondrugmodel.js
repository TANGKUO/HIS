import request from '@/utils/request'

export function getNondrugModelList(data) {
  return request({
    url: '/NonDrugModel/listModel',
    method: 'get',
    params: data
  })
}

export function updateModel(data){
  return request({
    url:'/NonDrugModel/updateModel',
    method:'post',
    params:{
      modelId:data.id
    },
    data
  }
  )
}


export function createModel(data){
  return request({
    url:'/NonDrugModel/createModel',
    method:'post',
    data
  }
  )
}

export function deleteModel(ids){
  return request({
    url: '/NonDrugModel/deleteModel',
    method: 'post',
    params: {ids}
  })
}