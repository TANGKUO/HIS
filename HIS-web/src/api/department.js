import request from '@/utils/request'

export function getDeplist(data) {
  return request({
    url: '/dept/select',
    method: 'post',
    params: {
      pageSize:data.limit,
      pageNum:data.page
    },
    data
  })
}
export function getAllDep(){
  return request({
    url: '/dept/selectAll',
    method: 'get'
  })
}

export function createDep(data){
  return request({
    url: '/dept/create',
    method: 'post',
    data
  })
}

export function deleteDep(ids){
  return request({
    url: '/dept/delete',
    method: 'post',
    params: {ids}
  })
}

export function updateDep(data){
  return request({
    url: '/dept/update/'+data.id,
    method: 'post',
    data
  })
}