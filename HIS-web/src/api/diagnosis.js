import request from '@/utils/request'
export function getDmscatlist() {
  return request({
    url: '/DmsDiseCatalog/listAll',
    method: 'post'
  })
}

export function getDmsDislist(data) {
  return request({
    url: '/DmsDise/list',
    method: 'get',
    params:data
  })
}

export function createDmsDiscat(data) {
  return request({
    url: '/DmsDiseCatalog/create',
    method: 'post',
    data
  })
}

export function delDmsDiscat(data){
  return request({
    url: '/DmsDiseCatalog/delete',
    method: 'post',
    params:{
      ids: data
    }
  })
}

export function editDmsDiscat(data){
  return request({
    url: '/DmsDiseCatalog/update/'+data.id,
    method: 'post',
    data
  })
}

export function createDmsDis(data) {
  return request({
    url: '/DmsDise/create',
    method: 'post',
    data
  })
}

export function editDmsDis(data){
  return request({
    url: '/DmsDise/update/'+data.id,
    method: 'post',
    data
  })
}

export function delDmsDis(data){
  return request({
    url: '/DmsDise/delete',
    method: 'post',
    params:{
      ids: data
    }
  })
}

export function parseList(data) {
  return request({
    url: '/DmsDise/parseList',
    method: 'post',
    params:{
      idsStr:data
    }
  })
}