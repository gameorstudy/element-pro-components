<template>
  <el-button
    class="btn-add"
    icon="el-icon-plus"
    :style="recordCreatorProps.style"
    v-bind="{ size, plain: true, ...recordCreatorProps.buttonProps }"
  >
    {{ recordCreatorProps.creatorButtonText }}
  </el-button>
</template>

<script>
  export default {
    name: 'RecordCreatorButton',
    props: {
      recordCreatorProps: {
        type: [Boolean, Object],
        required: true
      },
      size: {
        type: String
      }
    },
  }
</script>

<style scoped>
.btn-add {
  width: 100%;
  margin: 10px 0;
  border-style: dashed;
}
</style>
