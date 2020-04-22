import qs from 'qs'
import { Message } from 'element-ui'
/**
 * 绑定事件
 * @param {HTMLHtmlElement} element 需要绑定事件的对象
 * @param {String} eventType 绑定的事件类型
 * @param {Function} eventHandler 绑定事件的回调
 */
export const on = (element, eventType, eventHandler) => {
  if (element.addEventListener) {
    element.addEventListener(eventType, eventHandler)
  } else {
    element.attachEvent(`on${eventType}`, eventHandler)
  }
}

/**
 * 解绑事件
 * @param {HTMLHtmlElement} element 需要解绑事件的对象
 * @param {String} eventType 解绑的事件类型
 * @param {Function} eventHandler 解绑事件的回调
 */
export const off = (element, eventType, eventHandler) => {
  if (element.removeEventListener) {
    element.removeEventListener(eventType, eventHandler)
  } else {
    element.detachEvent(`on${eventType}`, eventHandler)
  }
}
/**
 * Generate random string.
 * @return { String }
 */
export const randomStr = () => (Math.floor(Math.random() * 100000) * Date.now()).toString(16)

/**
 * 判断数据类型方法
 */
export const [isArray, isString, isObject, isNumber, isFunction, isDate, isUndefined, isNull] = [
  'Array',
  'String',
  'Object',
  'Number',
  'Function',
  'Date',
  'Undefined',
  'Null'
].map(name => value => Object.prototype.toString.call(value) === `[object ${name}]`)

/**
 * 判断是否DOM节点
 * @param { HTMLHtmlElement }
 * @return { Boolean }
 */
export const isDOM =
  typeof HTMLElement === 'object'
    ? obj => obj instanceof HTMLElement
    : obj => obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'

/**
 * 判断浏览器是否支持特定的css3属性
 * @param {String} attr 属性名
 * @param {String|Number} value 属性值
 */
export function cssSupport (attr, value) {
  let element = document.createElement('div')
  if (attr in element.style) {
    element.style[attr] = value
    return element.style[attr] === value
  } else {
    return false
  }
}

/**
 * 判断target元素是否包含在source元素当中
 * @param { HtmlElement } target 被包含的元素
 * @param { HtmlElement } source 包裹元素
 * @param { Boolean } addSelf 是否要包括包裹元素
 * @return { Boolean }
 */
export function contains (target, source, addSelf) {
  return isDOM(target) && isDOM(source) && (source.contains(target) || (addSelf && target === source))
}
/**
 * 通过某个key及其对应的值从对象数组中找到对应的对象
 * @param { Array } arr 目标数组
 * @param { Any } key 对象的key
 * @param { Any } value 对象的key对应的值
 * @return { Object }
 */
export const findObjectInArray = (arr, key, value) => arr.find(item => item[key] === value) || {}

/**
 * hex2rgb
 * @param { String } color
 * @return { Array }
 */
export const hex2rgb = color => {
  let clr = color.replace('#', '')
  if (clr.length === 3) {
    clr = clr
      .split('')
      .map(i => i + i)
      .join('')
  }
  if (!/^0x/.test(clr)) {
    clr = '0x' + clr
  }
  return [clr >> 16, (clr >> 8) & 0xff, clr & 0xff]
}

/**
 * hex2rgba
 * @param { String } color
 * @param { Number } alpha
 */
export const hex2rgba = (color, alpha) => [...hex2rgb(color), alpha]

/**
 * rgb2hex
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
export const rgb2hex = (r = 0, g = 0, b = 0) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

/**
 * num2percent
 * @param {Number} num
 * @return {String}
 */
export const num2percent = (num, dec = 0, unit = '%') => {
  const value = Number(num)
  if (isNaN(value)) return num
  const fixed = Math.pow(10, dec)
  return (Math.round(value * 100 * fixed) / fixed).toFixed(dec) + unit
}

export const isTest = process.env.NODE_ENV !== 'production' || /^test/.test(window.location.hostname)

export function getUrlKey (name, source) {
  return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).test(source || location.href) ? RegExp.$1 : '').replace(/\+/g, '%20')) || null
}
/**
 * 获取当前年
 */
export function getYear () {
  return new Date().getFullYear()
}

export function hasClass (el, className) {
  if (el.classList) return el.classList.contains(className)
  return el.className.split(/\s+/).includes(className)
}

export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}
/**
 * 响应数据格式化
 */
export const responseFormat = {
  /**
   * 将数据中string类型的数值转换为number类型
   * @param {any} data 原始数据对象
   * @param {string[]} fields 需要转换的键
   * @param {boolean} deep 深度处理
   */
  string2number (data, fields = [], deep) {
    if (!data) return data
    if (typeof data === 'string') return Number(data) || 0
    if (isArray(data)) {
      return deep ? data.map(item => responseFormat.string2number(item, fields, deep)) : data
    }
    if (typeof data === 'object') {
      const format = value => {
        if (typeof value === 'string') {
          return Number(value)
        }
        if (Array.isArray(value)) return value.map(Number)
        if (deep && value && typeof value === 'object') return responseFormat.string2number(value, fields, deep)
        return value
      }
      return Object.keys(data).reduce((acc, key) => {
        let origin = data[key]
        if (fields.includes(key)) {
          acc[key] = format(origin)
        } else {
          acc[key] = deep && origin && typeof origin === 'object' ? responseFormat.string2number(origin, fields, deep) : origin
        }
        return acc
      }, {})
    }
    return data
  }
}

/**
 * 从嵌套数组中找出对应的项
 * @param { Array } data 源数据
 * @param { any } target 要查找的值
 * @param { string } children 嵌套数组的键名
 */
export function findNest (data, target, children = 'children') {
  for (let item of data) {
    if (target === item) return item
    const type = typeof target
    if (type === 'undefined') return data
    if (type === 'function' && target(item)) return item
    if (item && isArray(item[children])) {
      const ret = findNest(item[children], target)
      if (ret !== undefined) return ret
    }
  }
}

/**
 * 数组转嵌套
 * @description 注意父级元素需要在子级元素之前
 * @param {array} data 数据源
 * @param {object} options
 * @param {string} options.refer 父级参照
 * @param {string} options.key 子级参照
 * @param {string} options.children 子级键名
 */
export function createNest (data, options = {}) {
  const { refer = 'id', key = 'parent_id', children = 'children' } = options
  const result = []
  for (let item of data) {
    const ref = item[key] // 参照
    // 查找父级元素
    const target = findNest(result, data => data[refer] === ref, children)
    if (target) {
      if (!target[children]) {
        target[children] = []
      }
      target[children].push({ ...item })
    } else {
      result.push({ ...item })
    }
  }
  return result
}

/**
 * 数组扁平化
 * @param {array} data
 * @param {number} depth
 * @param {function} callback
 * @return {array}
 */
export function flat (data, depth = 1, callback) {
  if (Array.isArray(data)) {
    let i = 0
    let len = data.length
    const result = []
    for (; i < len; i++) {
      const item = data[i]
      if (item === undefined) continue
      if (depth > 0 && Array.isArray(item)) {
        result.push(...flat(item, depth - 1, callback))
        continue
      }
      const res = typeof callback === 'function' ? callback(item, i) : item
      result.push(res)
    }
    return result
  }
}

export function flatMap (data, callback, context) {
  return flat(data, 1, function (value, index) {
    return callback.call(context, value, index, data)
  })
}

/**
 * 格式化下拉框数据
 * @param {array} data 下拉框数组
 * @param {string} labelField label对应的field
 * @param {string} valueField value对应的field
 */
export const formatSelectOption = (data = [], labelField = 'name', valueField = 'id') => {
  if (data && Array.isArray(data)) {
    return data.map(item => {
      if (item && typeof item === 'object') {
        const { [labelField]: label, [valueField]: value, ...props } = item
        return {
          label,
          value,
          ...props
        }
      } else {
        return {
          label: item,
          value: item
        }
      }
    })
  }
  return []
}

export const unHtml = str =>
  str.replace(/(["'<>]|&(?:(amp|lt|gt|#39|nbsp|quot|#\d+);)?)/g, (a, b, c) =>
    c
      ? a
      : {
        '<': '&lt;',
        '&': '&amp;',
        '"': '&quot;',
        '>': '&gt;',
        "'": '&#39;'
      }[a]
  )
// 将str中的转义字符还原成html字符
export const echoHtml = str =>
  str.replace(/&(amp|gt|lt|quot|#39|nbsp);/g, a => {
    return {
      '&lt;': '<',
      '&amp;': '&',
      '&quot;': '"',
      '&gt;': '>',
      '&#39;': "'",
      '&nbsp;': ' '
    }[a]
  })

export const allSettled = requests => new Promise(resolve => {
  const result = []
  const len = requests.length
  let count = 0
  requests.forEach((item, i) => {
    item.then(
      value => {
        result[i] = {
          status: 'fulfilled',
          value
        }
        count++
        if (count === len) resolve(result)
      },
      (reason) => {
        count++
        result[i] = {
          status: 'rejected',
          reason
        }
        if (count === len) resolve(result)
      }
    )
  })
})

/**
 * 列筛选
 */
export const filterColumns = (value, columns) =>
  columns.reduce((result, { hide, ...item }) => {
    if (typeof hide === 'function') {
      if (hide(value)) return result
    }
    result.push(item)
    return result
  }, [])

/**
 * 生成渐变数组
 */
export const gradientColor = (startColor, endColor, step) => {
  const y = Math.max(step, 1)
  const [startR, startG, startB] = hex2rgb(startColor)
  const [endR, endG, endB] = hex2rgb(endColor)
  const sR = (endR - startR) / y
  const sG = (endG - startG) / y
  const sB = (endB - startB) / y
  const colors = []
  for (let i = 0; i < step; i++) {
    const r = parseInt(sR * i + startR)
    const g = parseInt(sG * i + startG)
    const b = parseInt(sB * i + startB)
    const hex = rgb2hex(r, g, b)
    colors.push(hex)
  }
  return colors
}

/**
 * 消息提示队列
 * @param {string} msg
 * @param {number} delay
 */
export const alertMessage = (() => {
  const queue = []
  let timer = null
  return (msg = '', delay = 1000) => {
    if (!msg) return
    queue.push({
      msg,
      callback () {
        setTimeout(() => Message.error(msg), queue.length * delay)
      }
    })
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      const temp = []
      while (queue.length > 0) {
        const { msg, callback } = queue.shift()
        if (temp.includes(msg)) continue
        temp.push(msg)
        callback()
      }
    }, 500)
  }
})()

export const translateDataToTree = (data, id = 0, refer = 'parent_id') => data.filter(item => item[refer] === id).map(item => ({ ...item, children: translateDataToTree(data, item.id) }))

export const entries = Object.entries || ((obj) => Object.keys(obj).map(key => [key, obj[key]]))

export const parseQueryString = str => qs.parse((str || window.location.search.slice(1)))

export const broadcast = (context, componentName, event, eventHandler) => {
  const name = context.$options.componentName
  if (name === componentName) {
    context.$emit(event, eventHandler)
  } else {
    const children = context.$children || []
    children.forEach(child => broadcast(child, componentName, event, eventHandler))
  }
}

export const dispatch = (context, componentName, event, eventHandler) => {
  const name = context.$options.componentName
  if (name === componentName) {
    context.$emit(event, eventHandler)
  } else {
    const parent = context.$parent || context.$root
    if (parent) dispatch(parent, componentName, event, eventHandler)
  }
}

/**
 * 分割数组
 */
export const splitArray = (arr = [], amount, average) => {
  const data = arr.concat([])
  if (data.length === 0) return []
  if (amount > 0) {
    const count = average ? Math.ceil(data.length / amount) : amount
    return [data.splice(0, count)].concat(splitArray(data, amount, average))
  }
  return [data]
}

const _pre = process.env.VUE_APP_MOCK === 'mock' ? '/mock' : process.env.NODE_ENV !== 'production' ? '/api' : ''
export const setBaseURL = (url) => require('path').join(_pre, url)

/**
 * 数组中找最大值
 * @param {array} data 数值数组
 * @param {boolean|number} deep 数组维度
 */
export const findMaxValue = (data, deep) => Math.max(...flat(data, deep === true ? Infinity : deep).filter(n => !isNaN(Number(n))))

export const powDecimal = n => Math.pow(10, n.toFixed(0).length - 1)

/**
* 设置echarts轴间隔
* @param {Number} max 最大值
* @return {Number} interval
*/
export const setAxisInterval = (max) => {
  const value = Math.abs(max)
  if (isNaN(value)) return
  const r = powDecimal(value)
  return Math.ceil(value / r) * r / 4
}
