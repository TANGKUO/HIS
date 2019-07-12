import request from '@/utils/request'
export function createModel(data) {
  return request({
    url: '/drugModel/createModel',
    method: 'post',
    data
  })
}
export function deleteModel(data) {
  return request({
    url: '/drugModel/deleteModel',
    method: 'post',
    params: {
      ids:data
    },
  })
}

export function listModel(data) {
  return request({
    url: '/drugModel/listModel',
    method: 'get',
    params: data,
  })
}

export function updateModel(data) {
  return request({
    url: '/drugModel/updateModel',
    method: 'post',
    params: {
      modelId:data.id
    },
    data
  })
}