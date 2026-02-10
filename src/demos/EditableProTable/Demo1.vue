<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" size="small">
      <el-form-item label="表格" prop="table">
        <EditableProTable 
          ref="editableProTableRef"
          :formRef="$refs.formRef"
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
      </el-form-item>
      <el-button @click="onClick">提交</el-button>
      <el-button @click="clear">清除</el-button>
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
          type: 'multiple',
          editableKeys: this.editableKeys,
          onChange: (editableKeys, editableRows) => {
            this.editableKeys = editableKeys
          },
          onSave: (recordKey, row, originRow) => {
            console.log(recordKey, row, originRow)
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 1000)
            })
          },
          // actionRender: (row, config, doms) => {
          //   return [
          //     <el-button onClick={async () => {
          //       this.loading = true
          //       const row = this.form.table[config.index]
          //       const res = await config.onSave(config.recordKey, row, config.preEditRow)
          //       if (res !== false) {
          //         this.loading = false
          //       }
          //     }} type="text" loading={this.loading}>自定义保存</el-button>
          //   , doms.cancel]
          // }
        }
      },
      columns() {
        return [
          {
            label: '名称',
            prop: 'name',
            valueType: 'input',
            // formatter: (row, column, cellValue, index) => {
            //   return `hello, ${cellValue}`
            // },
            formItemProps: {
              rules: [{ required: true, message: '请输入', trigger: ['blur']}]
            },
            renderCell: (scope) => <span style="color: red">{ scope.row.name }</span>,
            'show-overflow-tooltip': true,
            editable: (cellValue, record, index) => {
              console.log(cellValue, record)
              return !cellValue
            }
          },
          {
            renderCellHeader: (scope) => {
              return <span style="color: red">标签</span>
            },
            prop: 'label',
            formItemProps: {
              rules: [{ required: true, message: '请输入', trigger: ['change']}]
            },
            valueType: 'select',
            fieldProps: {
              clearable: true
            },
            fieldEvents: {
              change: (val, config) => {
                console.log('val', val, config)
              },
              blur: (e, config) => {
                console.log('e', e, config)
              }
            },
            options: [
              { label: '标签一', value: '1' },
              { label: '标签二', value: '2' },
              { label: '标签三', value: '3' },
            ],
          },
          {
            prop: 'date',
            label: '日期',
            formItemProps: {
              rules: [{ required: true, message: '请选择', trigger: ['blur', 'change']}]
            },
            valueType: 'date-picker',
          },
          {
            width: 150,
            fixed: 'right',
            label: '操作',
            valueType: 'option',
            key: 'option',
            renderCell: (record, index, action) => {
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
            // { name: '名称一', label: '1', labelName: '标签一', id: 1 },
            // { name: '名称二', label: '2', labelName: '标签二', id: 2 },
          ]
        },
        rules: {
          table: [
            { required: true, message: '至少1条数据' }
          ]
        },
        position: 'top',
        editableKeys: [],
        loading: false
      }
    },
    methods: {
      onClick() {
        this.$refs.formRef.validate((valid) => {
          console.log(valid)
        })
      },
      clear() {
        this.$refs.formRef.clearValidate(['table.0.name'])
      }
    },
  }
</script>

<style scoped>

</style>
