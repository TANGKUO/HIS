import request from '@/utils/request'
export function getRulelist(data) {
  return request({
    url: '/skd/listRule',
    method: 'post',
    params:data
  })
}

export function generateSkd(data) {
  return request({
    url: '/skd/generateSkd',
    method: 'post',
    params:data
  })
}

export function createRule(data) {
  return request({
    url: '/skd/createRule',
    method: 'post',
    data
  })
}

export function getRuleDetail(id) {
  return request({
    url: '/skd/getRuleDetail',
    method: 'post',
    params: {
      ruleId:id
    }
  })
}

export function updateRule(data) {
  return request({
    url: '/skd/updateRule/'+data.ruleid,
    method: 'post',
    data
  })
}

export function deleteRule(data) {
  return request({
    url: '/skd/deleteRule',
    method: 'post',
    params:{
      ids:data
    }
  })
}

export function querySkd(data) {
  return request({
    url: '/skd/listSkd',
    method: 'post',
    params:data
  })
}