<template>
  <div>
    <el-form :model="form" size="small">
      <EditableProTable 
        ref="editableProTableRef"
        :value="form.table"
        :recordCreatorProps="recordCreatorProps"
        :maxLength="6"
        :editable="editable"
        rowKey="id"
        name="table"
        className="demo-table"
        :columns="columns"
        defaultSize="small"
      >
        <el-radio-group v-model="position" style="display: flex; justify-content: flex-end;">
          <el-radio label="top">添加到顶部</el-radio>
          <el-radio label="bottom">添加到底部</el-radio>
          <el-radio label="hidden">隐藏</el-radio>
        </el-radio-group>
      </EditableProTable>
    </el-form>
  </div>
</template>

<script>
  import EditableProTable from '@/components/EditableProTable'

  export default {
    name: 'Demo1',
    components: {
      EditableProTable,
    },
    computed: {
      recordCreatorProps() {
        const { position } = this
        return position !== 'hidden'
            ? {
                position,
                newRecordType: 'dataSource',
                record: (index, dataSource) => {
                  return { id: (Math.random() * 1000000).toFixed(0) }
                },
                creatorButtonText: '新增一行',
                style: { 'border-style': 'solid' },
                buttonProps: { size: 'medium' }
              }
            : false
      },
      editable() {
        return {
          editableKeys: this.editableKeys,
          onChange: (editableKeys, editableRows) => {
            this.editableKeys = editableKeys
            console.log('editableRows', editableRows)
          },
        }
      },
      columns() {
        return [
          {
            label: '名称',
            prop: 'name',
            valueType: 'input',
            formatter: (row, column, cellValue, index) => {
              return `hello, ${cellValue}`
            },
            'show-overflow-tooltip': true
          },
          {
            renderCellHeader: (scope) => {
              return <span style="color: red">标签</span>
            },
            prop: 'label',
            valueType: 'select',
            options: [
              { label: '标签一', value: '1' },
              { label: '标签二', value: '2' },
              { label: '标签三', value: '3' },
            ],
          },
          {
            width: 150,
            fixed: 'right',
            label: '操作',
            valueType: 'option',
            key: 'option',
            renderCell: (record, index, action) => {
              console.log('action', record, index, action)
              return [
                <el-button type="text" onClick={() => action?.startEditable(record.id)}>编辑</el-button>,
                <el-button type="text">删除</el-button>,
                <el-button type="text">复制</el-button>
              ]
            }
          }
        ]
      }
    },
    data() {
      return {
        form: {
          table: [
            { name: '名称一', label: '1', labelName: '标签一', id: 1 },
            { name: '名称二', label: '2', labelName: '标签二', id: 2 },
          ]
        },
        position: 'top',
        editableKeys: []
      }
    },
  }
</script>

<style scoped>

</style>
