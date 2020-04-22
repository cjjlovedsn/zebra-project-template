import axios from '../plugins/axios'

const cache = {}
/**
 * 获取token
 */
export const getToken = () => Promise.resolve('token')

export const cleanToken = () => (cache.token = null)

export const getPermissions = () => Promise.resolve([])
