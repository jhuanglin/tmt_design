<template>
    <div class="count_button" @click="click">
        <p class="button_title">{{ title }}</p>
        <p class="button_content">{{ content }}</p>
    </div>
</template>

<script>
export default {
  props: ['title', 'content', 'type'],
  methods: {
    click () {
      this.$emit('listen', this.type)
    }
  }
}
</script>

<style lang="scss" scoped>
.count_button{
  min-width: 100px;
  text-align: center;
  line-height: 24px;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px 0;
  cursor: pointer;
  box-shadow: 3px 2px 10px #dcd1d1;
  .button_title {
    font-size: 16px;
  }
  .button_content {
    font-size: 30px;
    color: #666;
  }
}
</style>
