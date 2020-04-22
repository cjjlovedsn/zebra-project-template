export default {
  // 用户权限
  perms: state => state.userinfo?.perms ?? [],
  // 用户接口及操作权限
  // eslint-disable-next-line eqeqeq
  operateAuthority: state => state.userinfo?.perms?.filter(item => item.type == 2 && item.path)?.map(item => item.path) ?? []
}
