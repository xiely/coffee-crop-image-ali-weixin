import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/gw/v1/user/login/login',
        method:'post',
        headers: {
            isToken: false
        },
        data:{
            data: data
        }
    })
}
export function checkCode(data) {
    return request({
      url: '/gw/v1/uploadImage',
      method: 'post',
      data: data
    })
  }

  export function random(data) {
    return request({
      url: '/gwop/refreshToken',
      method: 'get',
      data: data
    })
  }

 export function orderId(data) {
    return request({
      url: '/gwop/order/orderMakeToken',
      method: 'get',
      data: data
    })
  }
export function flowerSet(data) {
    console.log(data, "flowerSet data")
    let obj =JSON.parse(JSON.stringify(data));
    delete obj.randomId
    return request({
      url: `/gwop/order/flowerSet?randomId=${data.randomId}`,
      method: 'post',
      data:{
        data: obj
      }
    })
  }


