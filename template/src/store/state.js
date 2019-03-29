const metaEl = document.querySelector('meta[name=token]')
const token = metaEl ? metaEl.content : ''
export default {
  token
}
