import request from '@/utils/request'

export function getNondrugList(data) {
  return request({
    url: '/DmsNonDrug/list',
    method: 'get',
    params: data
  })
}

export function getAllNondrug(){
  return request({
    url: '/DmsNonDrug/listAll',
    method: 'post'
  })
}

export function updateNondrug(data){
  return request({
    url: '/DmsNonDrug/update/'+data.id,
    method: 'post',
    data
  })
}

export function deleteNondrug(ids){
  return request({
    url: '/DmsNonDrug/delete',
    method: 'post',
    params: {ids}
  })
}

export function createNondrug(data){
  return request({
    url: '/DmsNonDrug/create',
    method: 'post',
    data
  })
}