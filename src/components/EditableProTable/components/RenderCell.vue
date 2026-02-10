<template>
  <Fragment>
    <!-- pro-form-item -->
    <!-- start -->
    <EditableFormItem
      v-if="isEditable && editableCallback"
      :formItem="formItem"
      :editable="true"
      :name="name"
      :scope="scope"
      :form="scope.row"
      :rowKey="rowKey"
      :index="index"
      :recordKey="recordKey"
      :formRef="formRef"
    >
      <template #[formItem.prop]>
        <slot :name="formItem.prop" v-bind="{ scope }" />
      </template>
    </EditableFormItem>
    <!-- end -->
    <!-- 文本 -->
    <!-- start -->
    <template v-else>
      <custom-render v-if="column.nonElColumnProps.renderCell" :render="() => column.nonElColumnProps.renderCell(scope)" />
      <CellView v-else :column="column" :formItem="formItem" :scope="scope" />
    </template>
    <!-- end -->
  </Fragment>
</template>

<script>
  import EditableFormItem from '../components/EditableFormItem.vue'
  import CellView from './CellView.vue'
  import CustomRender from '@/components/CustomRender'

  export default {
    name: 'RenderCell',
    components: {
      EditableFormItem,
      CellView,
      CustomRender
    },
    props: {
      editable: {
        type: Object,
        required: true
      },
      column: {
        type: Object,
        required: true 
      },
      formItem: {
        type: Object,
        required: true
      },
      name: {
        type: String,
      },
      scope: {
        type: Object,
        required: true
      },
      rowKey: {
        type: [Number, String]
      },
      preEditRows: {
        type: Map
      },
      recordKey: {
        type: [Number, String]
      },
      index: {
        type: Number
      },
      formRef: {
        type: Object
      }
    },
    computed: {
      isEditable() {
        const { rowKey, scope: { row } } = this
        if (!rowKey || !row) {
          return
        }

        const { editable } = this
        if (Array.isArray(editable.editableKeys) === false) {
          return
        }

        if (editable.editableKeys.includes(row[rowKey]) === false) {
          return
        }

        return true
      },
      editableCallback() {
        const { nonElColumnProps: { readonly, editable }, prop } = this.column
        if (readonly) {
          return false
        }

        if (typeof editable === 'function') {
          const { preEditRows } = this
          const record = preEditRows.get(this.recordKey)
          if (record) {
            console.log('record', record)
            return editable(record[prop], record, this.index)
          }
        }

        return true
      }
    },
  }
</script>

<style scoped>

</style>
