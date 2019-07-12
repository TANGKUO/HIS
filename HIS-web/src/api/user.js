import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/staff/login',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/staff/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/staff/update/'+data.id,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/staff/info',
    method: 'get'
  })
}

export function logout() {
  return Promise.resolve()
}

export function select(data){
  return request({
    url: 'staff/select',
    data,
    params:{
      pageSize:data.pageSize,
      pageNum:data.pageNum
    },
    method: 'post',
  })
}

export function getUserList(data){
  return request({
    url: 'staff/select',
    data,
    params:{
      pageSize:100000,
      pageNum:1
    },
    method: 'post',
  })
}


