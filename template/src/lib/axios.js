import axios from 'axios'
import { Message } from 'element-ui'
import { SET_LOADING, UPDATE_TOKEN } from '../store/mutation-types'

const httpErrorMessage = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

const TIMEOUT = 20 * 1e3 // 超时时间20s

const CancelToken = axios.CancelToken
const requests = {}
// 通过判断请求参数中有无cancelToken字段，去取消重复的请求
const cancelTokenHandler = ({ data, url, method }) => {
  let k = `${method}_${url}_${JSON.stringify(data)}`
  requests[k] && requests[k]()
  return new CancelToken(c => {
    requests[k] = c
  })
}

axios.install = (Vue, { store, router }) => {
  if (process.env.NODE_ENV !== 'production') store.dispatch(UPDATE_TOKEN)
  axios.interceptors.request.use(config => {
    config.cancelToken = cancelTokenHandler(config)
    config.currentRoute = router.currentRoute
    // 请求统一添加token参数
    config.headers['X-CSRF-TOKEN'] = store.getters.token
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
  })

  axios.interceptors.response.use(
    response => {
      // 请求结束清除cancelToken
      const { url, method, data: params } = response.config
      const k = `${method}_${url}_${JSON.stringify(params)}`
      if (requests[k]) {
        delete requests[k]
      }

      // 所有接口返回数据的success字段为false时，直接reject
      const { success } = response.data
      if (success === false) {
        return Promise.reject(response.data)
      }
      return response
    },
    error => {
      if (error) {
        if (error.response) {
          const { status, config } = error.response
          const message = httpErrorMessage[status]
          error.message = status === 404 ? `${message}:${config.url}` : message
          /**
           * 错误处理
           * 
           */
        } else {
          if (error.code === 'ECONNABORTED') {
            Message({
              type: 'error',
              message: '请求超时,请重试'
            })
          }
        }
      }
      return Promise.reject(error)
    }
  )

  if (process.env.NODE_ENV !== 'production') {
    axios.defaults.baseURL =
      process.env.VUE_APP_MOCK === 'mock'
        ? process.env.VUE_APP_MOCK_URL || '/mock'
        : process.env.VUE_APP_BASE_URL || '/api'
  }

  axios.defaults.withCredentials = true

  axios.defaults.timeout = TIMEOUT

  const setLoading = (key, value) =>
    key &&
    typeof key === 'string' &&
    store.commit(SET_LOADING, { [key]: value })

  // 包装方法，统一添加loading状态
  const handleWrap = (handle, _options = {}) => {
    const { url, params = {}, options = {} } = _options
    const { _loading, ...data } = params
    // 开启loading
    setLoading(_loading, true)
    return handle(url, data, options).finally(() => setLoading(_loading, false))
  }

  // 包装get方法，使其参数传递方式与post请求一致
  const axiosGet = axios.get
  axios.get = (url, params, options) =>
    handleWrap((url, params, opt) => axiosGet(url, { params, ...opt }), {
      url,
      params,
      options
    })

  // 包装post方法, 添加loading状态
  const axiosPost = axios.post
  axios.post = (url, params, options) =>
    handleWrap(axiosPost, {
      url,
      params,
      options
    })

  Vue.prototype.$http = Vue.prototype.axios = axios
}

export default axios
