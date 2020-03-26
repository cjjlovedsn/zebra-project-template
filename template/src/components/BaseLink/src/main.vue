<script>
import qs from 'qs'
const stringify = data => {
  if (data && typeof data === 'object') return qs.stringify(data)
  return String(data || '')
}
export default {
  functional: true,

  name: 'BaseLink',

  props: {
    type: {
      type: String,
      default: 'primary'
    },
    href: String,
    router: Boolean,
    disabled: Boolean,
    query: null,
    media: Boolean,
    prevent: Boolean,
    baseUrl: {
      type: String,
      default: process.env.VUE_APP_TEST_URL
    }
  },

  render (h, context) {
    const { href: origin, disabled, router, type, query, media, baseUrl = '', prevent } = context.props
    const queryString = stringify(query)
    let href = (/^\//.test(origin) ? (baseUrl + origin) : origin)
    if (query) {
      href = href.replace(/\??$/, `?${queryString}`)
    }
    if (disabled) {
      return <a disabled class="base-link is-disabled" { ...context.data }>{ context.children }</a>
    }
    if (prevent) {
      return <a disabled class="base-link" { ...context.data }>{ context.children }</a>
    }
    const theme = `base-link base-link--${type}`
    if (router) return <router-link class={ theme } { ...context.data }>{ context.children }</router-link>
    if (media) return (<video src={href} { ...context.data }>{ context.children }</video>)
    return (<a href={ href } class={ theme } { ...context.data }>{ context.children }</a>)
  }
}
</script>

<style lang="scss">
  .base-link {
    text-decoration: none;
    font-size: 12px;
    cursor: pointer;
    &.base-link-- {
      @each $key, $value in $theme-colors {
        &#{$key} {
          color: $value;
          &:hover,
          &:focus,
          &:active {
            color: mix($value, $--color-white, 80%);
          }
        }
      }
    }
    &.is-disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      &:hover,
      &:focus,
      &:active {
        color: #c0c4cc;
      }
    }
    & + .base-link,
    & + .el-button.el-button--text {
      margin-left: 5px;
    }
  }
</style>
