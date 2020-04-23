const metaElement = document.querySelector('meta[name=token]')
const _token = metaElement?.content ?? ''
const token = _token.includes('csrf_token') ? null : _token
export default {
  token,
  menu: [],
  userinfo: {}
}
