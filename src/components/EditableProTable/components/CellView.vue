<template>
  <span :class="{ 'text-ellipsis': column['show-overflow-tooltip'] }">{{ value ?? '-' }}</span>
</template>

<script>
  export default {
    name: 'CellView',
    props: {
      // 列表项
      column: {
        type: Object
      },
      // 表单项
      formItem: {
        type: Object,
        required: true
      },
      scope: {
        type: Object,
        required: true
      },
    },
    computed: {
      // 文本
      value() {
        const { column, formItem, scope } = this
        const { prop, valueType, options, valueEnum } = formItem
        const { row, column: col, $index } = scope
        const cellValue = row[col.property]

        if (column.formatter) { // formatter
          return column.formatter(row, col, cellValue, $index)
        } else if (valueType === 'select') { // 选择器
          if (valueEnum) { // 枚举
            if (valueEnum instanceof Map) {
              return valueEnum.get(row[prop])
            } else {
              return valueEnum[row[prop]]
            }
          } else { // options
            const map = (options || []).reduce((accu, cur) => ({ ...accu, [cur.value]: cur.label }), {})
            return map[row[prop]]
          }
        }

        return cellValue
      }
    }
  }
</script>

<style scoped>
.text-ellipsis {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: inherit;    /* 继承父元素行高 */
}
</style>
