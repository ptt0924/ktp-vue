import axios from 'axios'
import {STATE} from "@/store/mutation-type"
import store from "../store"

export function request(config) {
  const request = axios.create({
    timeout: 50000, // 请求超时时间
    headers: {
      'token': window.localStorage.token,
    }
  })

  request.interceptors.response.use(
      // 箭头函数，一个参数时，可以省略调小括号 ()
    response => {
      if (response.data.state !== undefined) {
        store.commit(STATE, response.data.state)
      }
      return response
    }
  )
  return request(config)
}

export function fileRequest(config) {
  const request = axios.create({
    timeout: 50000,  // request timeout
    headers: {
      'Content-Type': 'multipart/form-data',
      'token': localStorage.getItem('token'),
    }
  })

  request.interceptors.response.use(
    response => {
      if (response.data.state !== undefined) {
        store.commit(STATE, response.data.state)
      }
      return response
    }
  )

  return request(config)
}