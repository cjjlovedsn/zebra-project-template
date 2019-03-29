<template>
  <span class="countdown">
    <template v-if="run">
      {{frontText}}
      <i class="countdown__count">{{countNum}}</i>
      {{afterText}}
    </template>
    <slot v-else></slot>
  </span>
</template>

<script>
export default {
  name: 'BaseCountdown',
  props: {
    count: {
      type: [Number, String],
      default: 10
    },
    value: Boolean,
    frontText: '',
    afterText: '',
    time: 0,
    unit: {
      type: [Number, String],
      default: 1000
    }
  },
  data () {
    return {
      countNum: this.count,
      timer: null,
      run: false
    }
  },
  watch: {
    time (value, oldvalue) {
      if (value !== oldvalue) {
        this.start()
      }
    }
  },
  computed: {
    divisor () {
      return typeof this.unit === 'string' ? this.unit === 'ms' ? 1 : 1000 : this.unit
    }
  },
  methods: {
    getCount (time) {
      return time > 0 ? ~~(this.count - (time - this.time) / this.divisor) : 0
    },
    start () {
      if (this.time > 0) {
        if (this.timer > -1) cancelAnimationFrame(this.timer)
        let n = this.getCount(new Date())
        if (n <= 0) return this.stop()
        this.run = true
        this.$emit('input', true)
        this.$emit('start')
        const countdown = () => {
          n = this.getCount(new Date())
          if (n > 0) {
            this.countNum = n
            this.timer = requestAnimationFrame(countdown)
          } else {
            this.stop()
          }
        }
        this.timer = requestAnimationFrame(countdown)
      } else {
        this.stop()
      }
    },
    stop () {
      if (this.timer > -1) cancelAnimationFrame(this.timer)
      this.run = false
      this.$emit('input', false)
      this.$emit('stop')
    }
  },
  created () {
    this.start()
  },
  destroyed () {
    if (this.timer > -1) cancelAnimationFrame(this.timer)
  }
}
</script>

<style lang="scss">
.countdown {
  &__count {
    line-height: 1;
    font-style: normal;
  }
}
</style>
