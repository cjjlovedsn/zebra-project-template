<script>
export default {
  name: 'BaseCountdown',

  props: {
    /**
     * 组件标签
     */
    tag: {
      type: String,
      default: 'span'
    },
    /**
     * 倒计时总数
    */
    count: {
      type: [ Number, String ],
      default: 10
    },
    /**
     * 初始时间
     */
    time: {
      type: Number,
      default: 0
    },
    /**
     * 计时单位（默认: 秒）
     */
    unit: {
      type: [ Number, String ],
      default: 1000
    }
  },

  computed: {
    divisor () {
      return typeof this.unit === 'string' ? this.unit === 'ms' ? 1 : 1000 : this.unit
    }
  },

  watch: {
    count (value) {
      this.initValue = value
    }
  },

  data () {
    return {
      initValue: this.count,
      value: this.count,
      timer: null,
      active: false
    }
  },

  methods: {
    computedCount (time, initTime) {
      const lastTime = initTime > 0 ? initTime : this.time
      return time > 0 ? ~~(this.initValue - (time - lastTime) / this.divisor) : 0
    },
    reset () {
      this.pause()
      this.value = this.initValue
    },
    start (time, count) {
      this.timer && cancelAnimationFrame(this.timer)
      this.active = true
      if (typeof count === 'number') {
        this.initValue = count
      }
      // 计数归零，停止计数
      const countdown = () => {
        this.value = this.computedCount(new Date(), time)
        if (this.value > 0) {
          this.timer = requestAnimationFrame(countdown)
        } else {
          this.pause()
          this.value = 0
        }
      }
      this.timer = requestAnimationFrame(countdown)
    },
    pause () {
      this.timer && cancelAnimationFrame(this.timer)
      this.timer = null
      this.active = false
    }
  },

  render (h) {
    const { $attrs: props, $listeners: on, value, active, start, pause, reset } = this
    const data = { props, on }
    const { default: countdown } = this.$scopedSlots
    /**
     * @slot 默认插槽
     */
    const children = countdown ? countdown({ value, start, pause, reset, active }) : this.$slots.default
    return h(this.tag, data, [children])
  }
}

</script>
