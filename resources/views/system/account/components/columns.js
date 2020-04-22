export default [
  {
    label: '序号',
    prop: 'number'
  },
  {
    label: '账户名',
    prop: 'account_name'
  },
  {
    label: '姓名',
    prop: 'nick_name'
  },
  {
    label: '角色',
    prop: 'role_name',
    formatter: row => row?.role_name?.join(',')
  },
  {
    label: '数据权限',
    prop: 'data_permission_name',
    formatter: row => row?.data_permission_name?.join(',')
  },
  {
    label: '邮箱',
    prop: 'email'
  },
  {
    label: '最后登录时间',
    prop: 'latest_login_time'
  },
  {
    label: '状态',
    prop: 'status_name',
    slotName: 'status'
  },
  {
    label: '创建时间',
    prop: 'created_at'
  },
  {
    label: '修改时间',
    prop: 'updated_at'
  },
  {
    label: '操作',
    slotName: 'operate'
  }
]
