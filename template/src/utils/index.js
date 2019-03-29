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
export const [
  isArray,
  isString,
  isObject,
  isNumber,
  isFunction,
  isDate,
  isUndefined,
  isNull
] = ['Array', 'String', 'Object', 'Number', 'Function', 'Date', 'Undefined', 'Null'].map(name => value => Object.prototype.toString.call(value) === `[object ${name}]`)

/**
 * 判断是否DOM节点
 * @param { HTMLHtmlElement }
 * @return { Boolean }
 */
export const isDOM = (typeof HTMLElement === 'object')
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
export const hex2rgb = color => [color >> 16, color >> 8 & 0xff, color & 0xff]

/**
 * hex2rgba
 * @param { String } color
 * @param { Number } alpha
 */
export const hex2rgba = (color, alpha) => [...hex2rgb(color), alpha]

/**
 * num2percent
 * @param {Number} num
 * @return {String}
 */
export const num2percent = (num, dec = 1, unit = '') => {
  const value = Number(num)
  if (isNaN(value)) return num
  const fixed = Math.pow(10, dec)
  return (Math.round(value * 100 * fixed) / fixed).toFixed(dec) + unit
}

export const isTest = process.env.NODE_ENV !== 'production' || /^test/.test(window.location.hostname)
