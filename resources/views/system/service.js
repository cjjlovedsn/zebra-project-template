import axios from '../../plugins/axios'

export const create = data => axios.post('/admin/permission/create', data, { loading: 'create' })

export const update = (id, data) => axios.post('/admin/permission/modify', { ...data, id }, { loading: 'update' })

export const remove = id => axios.post('/admin/permission/delete', { id }, { loading: 'remove' })

export const combine = list => axios.all(list.map(({ operateType, id, ...data }) => {
  switch (operateType) {
    case 'create':
      return create(data)
    case 'update':
      return update(id, data)
    case 'delete':
      return remove(id)
  }
}))

export default () => axios.post('/admin/permission/list', null, { loading: 'loading' }).then(res => res.data?.data?.list ?? [])

export const namespace = 'permissions'
