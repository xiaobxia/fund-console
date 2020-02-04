<template>
  <div>
    <i v-if="icon" :class="icon" style="margin-right: 16px; width: 16px"/>
    <span v-if="title" slot="title">{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
