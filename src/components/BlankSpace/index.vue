<template>
  <span v-html="$createBlankSpace(len)"/>
</template>

<script>

export default {
  name: 'BlankSpace',
  props: {
    len: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

