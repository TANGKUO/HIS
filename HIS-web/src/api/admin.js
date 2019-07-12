import request from '@/utils/request'
export function getReglist(data) {
  return request({
    url: '/registerRank/select',
    method: 'post',
    params: {
      code:data.code,
      name:data.name,
      price:data.price,
      seqNo:data.seqNo,
      status:data.status,
      pageSize:data.limit,
      pageNum:data.page
    }
  })
}
export function getAllReg(){
  return request({
    url: '/registerRank/selectAll',
    method: 'get'
  })
}

export function createReg(data){
  return request({
    url: '/registerRank/create',
    method: 'post',
    data
  })
}

export function deleteReg(ids){
  return request({
    url: '/registerRank/delete',
    method: 'post',
    params: {ids}
  })
}

export function updateReg(data){
  return request({
    url: '/registerRank/update/'+data.id,
    method: 'post',
    data
  })
}


export function getSettleCatlist(data) {
  return request({
    url: '/settleCat/select',
    method: 'post',
    params: {
      id:data.id,
      name:data.name,
      pageSize:data.limit,
      pageNum:data.page
    }
  })
}
export function getAllSettleCat(){
  return request({
    url: '/settleCat/selectAll',
    method: 'get'
  })
}

export function createSettleCat(data){
  return request({
    url: '/settleCat/create',
    method: 'post',
    data
  })
}

export function deleteSettleCat(ids){
  return request({
    url: '/settleCat/delete',
    method: 'post',
    params: {ids}
  })
}

export function updateSettleCat(data){
  return request({
    url: '/settleCat/update/'+data.id,
    method: 'post',
    data
  })
}

