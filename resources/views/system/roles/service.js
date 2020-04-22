import axios from '../../../plugins/axios'

const index = data => axios.post('/admin/role/list', data, { loading: 'list' }).then(res => res.data?.data ?? {})

export const getRole = id => axios.post('/admin/role/detail', { id }, { loading: 'role' }).then(res => res.data?.data ?? {})

export const update = (data, isEdit) => axios.post(isEdit ? '/admin/role/modify' : '/admin/role/create', data, { loading: 'save' }).then(res => res.data?.message || '操作成功')

export default index
