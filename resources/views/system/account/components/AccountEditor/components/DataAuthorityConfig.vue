<template>
  <div class="bdt1 pt-5">
    <base-title
      v-if="title"
      :title="title"
    />
    <DataAuthorityRow
      v-for="(item, index) in list"
      v-model="item.id"
      v-bind="$attrs"
      :key="index"
      ref="rows"
      @append="list.push(createItem())"
      @remove="removeHandler(index)"
    />
  </div>
</template>

<script>
import DataAuthorityRow from './DataAuthorityRow'
export default {
  name: 'DataAuthorityConfig',

  inheritAttrs: false,

  components: {
    DataAuthorityRow
  },

  props: {
    title: String,
    value: Array
  },

  watch: {
    value: {
      handler (value) {
        if (!value) return
        this.list = value.length === 0 ? [ this.createItem() ] : [ ...value ]
      },
      immediate: true,
      deep: true
    }
  },

  data () {
    return {
      list: []
    }
  },

  methods: {
    createItem () {
      return {
        id: []
      }
    },
    removeHandler (index) {
      if (this.list.length === 1) {
        this.list = [this.createItem()]
      } else {
        this.list.splice(index, 1)
      }
    },
    submit (callback) {
      callback && callback(this.list)
    }
  }
}
</script>

<style lang="scss" scoped></style>
