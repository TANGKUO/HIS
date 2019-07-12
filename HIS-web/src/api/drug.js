import request from '@/utils/request'
//获取药品分页列表
export function getdrugList(data) {
  return request({
    url: '/drug/selectDrug',
    method: 'post',
    params: data
  })
}

export function getAlldrug(){
  return request({
    url: '/drug/selectAllDrug',
    method: 'get'
  })
}

export function getAlldosage(){
  return request({
    url: '/drug/selectAllDosage',
    method: 'get'
  })
}

export function updatedrug(data){
  return request({
    url: '/drug/updateDrug/'+data.id,
    method: 'post',
    data
  })
}

export function deletedrug(ids){
  return request({
    url: '/drug/deleteDrug',
    method: 'post',
    params: {ids}
  })
}

export function createdrug(data){
  return request({
    url: '/drug/createDrug',
    method: 'post',
    data
  })
}

export function selectById(data){
  return request({
    url: '/drug/selectById',
    method: 'get',
    params:{
      id:data
    }
  })
}