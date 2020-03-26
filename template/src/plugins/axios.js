import Vue from 'vue'
import axios from 'axios'
import * as utils from '@/utils'

export const httpErrorMessage = {
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

const loop = () => {}

const isFunction = t => typeof t === 'function'

export const store = Vue.observable({ loadings: {} })
export const mutations = {
  setLoading (key, value) {
    store.loadings = { ...store.loadings, [key]: value }
  }
}

axios.$utils = {
  get (data, keys, defaults) {
    if (data === null || typeof data !== 'object') return data
    const fields = Array.isArray(keys) ? keys : String(keys).split('.')
    const toString = Object.prototype.toString
    const defaultType = toString.call(defaults)
    let value = data
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const k = fields[i]
      value = value[k]
      if (value !== null && typeof value === 'object') continue
      break
    }
    if (typeof defaults === 'undefined' || toString.call(value) === defaultType) return value
    return defaults
  }
}

// 超时重试次数
axios.defaults.retry = 3

// 超时重试间隔
axios.defaults.retryDelay = 500

// cancelToken列表
axios.defaults.tokenList = {}

const handleCancel = (cancel, data) => {
  if (!cancel) return
  const list = axios.defaults.tokenList
  const source = CancelToken.source()
  switch (typeof cancel) {
    case 'function':
      cancel(source, data)
      break
    case 'string':
      clearToken(cancel, true)
      list[cancel] = {
        source,
        data
      }
      break
    default:
      break
  }
  return source.token
}

/**
 * 清除已有的cancelToken
 * @param {string} token
 * @param {boolean} cancel 是否执行取消
 */
const clearToken = (token, cancel) => {
  if (!token) return
  const { source, data = {} } = axios.defaults.tokenList[token] || {}
  cancel && source && source.cancel(JSON.stringify(data))
  delete axios.defaults.tokenList[token]
}

/**
 * 移除参数中的空值
 */
export const removeEmptyValue = params => {
  if (params instanceof FormData || typeof params !== 'object' || Array.isArray(params)) return params
  const result = {}
  for (let k in params) {
    const value = params[k]
    if (value === '' || value === null) continue
    result[k] = value
  }
  return result
}

axios.install = (Vue, options = {}) => {
  const { debug, baseURL = '/', interceptors, responseHandler, errorHandler, setLoading = loop, beforeSend } = options
  if (interceptors) {
    axios.interceptors.request.use(config => interceptors(config))
  }

  axios.interceptors.response.use(
    response => {
      if (isFunction(responseHandler)) return responseHandler(response.data, response)
      return response
    },
    error => {
      /**
       * 超时重试处理
       */
      const config = error.config || {}
      const { status } = error.response || {}

      config.__retryCount = config.__retryCount || 0

      // 有重试次数且请求状态不为500或419时继续重试
      const needRetry = config.retry > 0 && config.__retryCount < config.retry && (!status || /^[^345]\d{2}/.test(status))

      if (needRetry) {
        config.__retryCount++
        return new Promise(resolve => {
          setTimeout(resolve, config.retryDelay || 1)
        }).then(() => axios({ ...config, baseURL: '' }))
      }
      return Promise.reject(error)
    }
  )

  axios.defaults.baseURL = baseURL

  axios.defaults.withCredentials = true

  axios.defaults.timeout = TIMEOUT

  // 包装方法，统一添加loading状态, 处理CancelToken
  const handleWrap = async (handle, settings) => {
    const { loading: loadingField, cancel, default: defaultValue, ...options } = settings.options ?? {}
    // 创建cancelToken, 取消重复请求
    const cancelToken = handleCancel(cancel, `取消请求: ${settings.url}; 请求参数:${JSON.stringify(settings.params ?? {})}`)
    // 开启loading
    loadingField && mutations.setLoading(loadingField, true)
    setLoading(loadingField, true)
    if (beforeSend) {
      await beforeSend(settings, data => {
        if (data instanceof FormData) return
        if (typeof data === 'object') {
          settings.params = removeEmptyValue(Object.assign(settings.params ?? {}, data))
        } else {
          settings.params = data
        }
      })
    }

    return new Promise((resolve, reject) => {
      handle(settings.url, settings.params, { ...options, cancelToken })
        .then(data => {
          resolve(data)
          // 请求结束之后关闭loading
          loadingField && mutations.setLoading(loadingField, false)
          setLoading(loadingField, false)
          // 清除canceltoken
          if (typeof cancel === 'string') {
            clearToken(cancel)
          }
        }, error => {
          // 请求结束之后关闭loading
          loadingField && mutations.setLoading(loadingField, false)
          setLoading(loadingField, false)
          // 清除canceltoken
          if (typeof cancel === 'string') {
            clearToken(cancel)
          }
          // 被取消的请求不需要抛出错误
          if (axios.isCancel(error)) {
            debug && console.log(error.message)
          } else {
            if (isFunction(errorHandler)) {
              const err = errorHandler(error)
              if (err instanceof Promise) return err.then(resolve).catch(reject)
              if (err) reject(err)
            } else {
              reject(error)
            }
          }
        })
    })
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

  axios.allSettled = utils.allSettled

  Vue.prototype.$http = Vue.prototype.axios = axios
  Vue.mixin({
    computed: {
      $loadings () {
        return store.loadings
      }
    }
  })
}

export default axios
