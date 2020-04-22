import axios from '../../../plugins/axios'
import { responseFormat } from '../../../../../utils'
const format = responseFormat.string2number
export const index = data => axios.post('/admin/user/list', data, { loading: 'list' }).then(res => res.data?.data || {})

export const update = (data, isEdit) => axios.post(isEdit ? '/admin/user/modify' : '/admin/user/create', data, { loading: 'update' }).then(res => res.data?.message || '操作成功')

export const getUser = id => axios.post('/admin/user/detail', { id }, { loading: 'detail' }).then(res => format(res.data?.data ?? {}, ['id'], true))

export const importFile = data => axios.post('/admin/user/import', data, {
  loading: 'importfile',
  headers: {
    'Content-Type': 'multipart/form-data;application/json;charset=UTF-8'
  },
  timeout: 60 * 10e3
}).then(res => res.data?.message || '导入成功')

export const changeState = (id, stoped) => axios.post(stoped ? '/admin/user/stop' : '/admin/user/start', { id }, { loading: 'changestate' }).then(res => res.data?.message || '操作成功')

export default index
