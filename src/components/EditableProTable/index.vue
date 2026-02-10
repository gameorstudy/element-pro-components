<template>
  <Fragment>
    <!-- toolbarRender -->
    <!-- start -->
    <slot></slot>
    <!-- end -->
    <div v-loading="loading" class="editable-pro-table">
      <!-- 上方新增一行的表头 -->
      <!-- start -->
      <template v-if="initializedRecordCreatorProps?.position === 'top'">
        <el-table class="table-head">
          <el-table-column 
            v-for="column in normalizedColumns"
            v-bind="{
              ...column,
              nonElColumnProps: undefined,
              formItem: undefined
            }"
            :resizable="false"
            :key="column.prop || column.nonElColumnProps.key"
          >
            <template v-if="column.nonElColumnProps.renderCellHeader" #header="scope">
              <!-- 覆写头部 -->
              <!-- start -->
              <CustomRender :render="() => column.nonElColumnProps.renderCellHeader(scope)" />
              <!-- end -->
            </template>
          </el-table-column>
          <template #empty>
            <RecordCreatorButton
              v-if="!exceedsMax"
              :recordCreatorProps="initializedRecordCreatorProps"
              :size="defaultSize"
              @click.native="addDefaultEditRecord"
            />
            <!-- placeholder -->
            <!-- start -->
            <span v-else></span>
            <!-- end -->
          </template>
        </el-table>
      </template>
      <!-- end -->
      <!-- 上方新增一行时隐藏表头 -->
      <!-- start -->
      <el-table
        ref="tableRef"
        :data="form[name]"
        :class="className"
        :size="defaultSize"
        v-bind="initializedTableProps"
        :show-header="initializedRecordCreatorProps?.position !== 'top'"
        v-on="tableEvents"
        :key="tableKey"
      >
        <el-table-column
          v-for="(column, index) in normalizedColumns"
          v-bind="{
            ...column,
            nonElColumnProps: undefined,
            formItem: undefined
          }"
          :key="column.prop || column.nonElColumnProps.key"
        >
          <template v-if="column.nonElColumnProps.renderCellHeader" #header="scope">
            <!-- 覆写头部 -->
            <!-- start -->
            <CustomRender :render="() => column.nonElColumnProps.renderCellHeader(scope)" />
            <!-- end -->
          </template>
          <template #default="scope">
            <!-- 操作栏 -->
            <!-- start -->
            <template v-if="column.nonElColumnProps.valueType === 'option'">
              <RenderEditable
                :render="(action) => column.nonElColumnProps.renderCell(
                  scope.row,
                  scope.$index,
                  action
                )"
                :validateRowData="validateRowData"
                :action="{ validateCanStartEdit, addEditRecord }"
                :dataSource="form[name]"
                :name="name"
                :row="scope.row"
                :index="scope.$index"
                :rowKey="rowKey"
                :recordCreatorProps="initializedRecordCreatorProps"
                :editable="initializedEditable"
                :isEditable="isEditable(scope.row)"
                :isNewLineRecordCache="newLineRecordCache?.options.recordKey === scope.row[rowKey]"
                @cancelEditable="onCancelEditable"
                @cancel="onCancel"
                @save="onSave"
                @delete="onDelete"
              />
            </template>
            <!-- end -->
            <!-- 可编辑元素栏 -->
            <!-- start -->
            <template v-else>
              <RenderCell
                :editable="initializedEditable"
                :column="column"
                :formItem="formItems[index]"
                :name="name"
                :scope="scope"
                :rowKey="rowKey"
                :recordKey="scope.row[rowKey]"
                :index="scope.$index"
                :preEditRows="preEditRows"
                :formRef="formRef"
              />
            </template>
            <!-- end -->
          </template>
        </el-table-column>
      </el-table>
      <!-- end -->
    </div>
    <RecordCreatorButton
      v-if="initializedRecordCreatorProps?.position === 'bottom' && !exceedsMax" 
      :recordCreatorProps="initializedRecordCreatorProps"
      :size="defaultSize"
      @click.native="addDefaultEditRecord"
    />
  </Fragment>
</template>

<script>
  import CustomRender from '@/components/CustomRender'
  import RenderEditable from './components/RenderEditable.vue'
  import RenderCell from './components/RenderCell.vue'
  import RecordCreatorButton from './components/RecordCreatorButton.vue'
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'  
  import { generateCryptoUID } from '@/utils/uid'


  export default {
    name: 'EditableProTable',
    components: {
      CustomRender,
      RenderEditable,
      RenderCell,
      RecordCreatorButton,
    },
    props: {
      // 同 dataSource
      value: {
        type: [Array, undefined],
        default: undefined
      },
      // 新建一行数据的相关配置
      recordCreatorProps: {
        type: [Boolean, Object],
        default: true
      },
      // 最大的行数，到达最大行数新建按钮会自动消失
      maxLength: {
        type: Number,
      },
      // 可编辑表格的相关配置
      editable: {
        type: Object,
        required: true
      },
      // 是否受控
      controlled: { // todo
        type: Boolean,
        default: false
      },
      // el-table 的 rok-key 属性
      rowKey: {
        type: [String, Number],
      },
      // 表格的名称
      name: {
        type: String,
        default: 'dataSource'
      },
      // 组件内 el-table 的类名
      className: {
        type: String,
      },
      // 表格数据请求加载状态
      loading: {
        type: Boolean,
      },
      // el-table attributes 的配置
      tableProps: {
        type: Object
      },
      // el-table events 的配置
      tableEvents: {
        type: Object
      },
      // 列定义
      columns: {
        type: Array,
        required: true
      },
      // 默认的 size
      defaultSize: {
        type: String,
        validator: function (value) {
          return ['medium', 'small', 'mini'].includes(value)
        },
      },
      formRef: {
        type: [Object, undefined]
      }
    },
    computed: {
      // recordCreatorProps 初始化
      initializedRecordCreatorProps() {
        const { recordCreatorProps } = this
        if (recordCreatorProps) {
          const defaultRecordCreatorProps = {
            position: 'bottom',
            newRecordType: 'cache',
            creatorButtonText: '添加一行数据',
            onlyAddOneLineAlertMessage: '只能新增一行'
          }
          if (typeof recordCreatorProps === 'object') {
            return {
              ...defaultRecordCreatorProps,
              ...recordCreatorProps
            }
          }

          return defaultRecordCreatorProps
        }

        return false
      },
      // editable 初始化
      initializedEditable() {
        const defaultEditable = {
          type: 'single',
          saveText: '保存',
          deleteText: '删除',
          cancelText: '取消',
          deletePopconfirmMessage: '删除此项？',
          onlyOneLineEditorAlertMessage: '只能同时编辑一行',
        }

        return {
          ...defaultEditable,
          ...this.editable
        }
      },
      // 是否超过了最大的行数
      exceedsMax() {
        const { maxLength } = this
        if (typeof maxLength === 'number') {
          return this.form[this.name].length >= maxLength
        }

        return false
      },
      // tableProps 初始化
      initializedTableProps() {
        const { rowKey, tableProps = {} } = this
        return { ...tableProps, 'row-key': rowKey }
      },
      // columns 标准化
      normalizedColumns() {
        return this.columns
          // 筛选隐藏项
          .filter(item => !item.hideInTable)
          .map((col) => {
            // 筛选 el-table-column 属性
            const {
              formItemProps,
              valueType,
              fieldProps,
              fieldEvents,
              options,
              valueEnum,
              optionLoader,
              renderCellHeader,
              renderCell,
              editable,
              readonly,
              key,
              ...keys
            } = col
            return {
              ...keys,
              nonElColumnProps: {
                valueType,
                renderCellHeader,
                renderCell,
                editable,
                readonly,
                key,
              }
            }
          })
      },
      // 表单项
      formItems() {
        const { columns } = this
        return (
          columns
            // 筛选隐藏项
            .filter(item => !item.hideInTable)
            // 筛选
            .map((col) => {
              const {
                prop,
                valueEnum,
                formItemProps = {},
                valueType,
                fieldProps = {},
                fieldEvents,
              } = col
              // 设置 el-form-item
              formItemProps.prop = prop
              formItemProps.label = ' '
              formItemProps['label-width'] = '12px'

              // 设置 placeholder
              setPlaceholder(fieldProps, valueType)

              // 设置 select options
              setSelectOptions(col, this.cachedOptions)

              // 设置 cascader options
              setCascaderOptions(fieldProps, col, this.cachedOptions)

              return {
                ...formItemProps,
                valueEnum,
                valueType,
                fieldProps,
                fieldEvents,
                options: col.options,
              }
            })
        )
      },
    },
    data() {
      return {
        form: {
          [this.name]: this.value,
        },
        cachedOptions: {}, // 下拉数据 { [prop]: data }
        tableKey: 1, // table key
        newLineRecordCache: undefined, // newRecordType: cache 的新增记录
        preEditRows: new Map(), // 
      }
    },
    watch: {
      // 监听元数据变化
      value(newValue) {
        this.form[this.name] = newValue
      },
      // 监听位置修改
      'recordCreatorProps.position': {
        handler() {
          this.tableKey = generateCryptoUID()
        }
      }
    },
    created () {
      // 获取异步数据
      this.getOptions()
    },
    methods: {
      /**
       * @desc 获取异步下拉数据
       */
      getOptions() {
        for (const item of this.columns) {
          const { prop, optionLoader } = item
          if (typeof optionLoader === 'function') {
            optionLoader().then(res => {
              this.cachedOptions = {
                ...this.cachedOptions,
                [prop]: res
              }
            })
          }
        }
      },
      getFormRef() {
        return this.formRef
      },
      getValidateFields(index) {
        return this.formItems
          .filter(item => item.rules)
          .map(item => `${this.name}.${index}.${item.prop}`)
      },
      validateRowData(index) {
        return new Promise(resolve => {
          const formRef = this.getFormRef()
          const fields = this.getValidateFields(index)
          if (fields.length === 0) {
            resolve(true)
            return
          }
          
          formRef.validateField(fields, err => {
            if (err) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        })
      },
      validate() {
        return new Promise(resolve => {
          const formRef = this.getFormRef()
          
          formRef.validate(valid => {
            resolve(valid)
          })
        })
      },
      /**
       * @desc 获取 table ref
       */
      getTableRef() {
        return this.$refs.tableRef
      },
      /**
       * @desc 获取行数据
       */
      getRowData(rowIndex) {
        if (typeof rowIndex === 'number') {
          return this.form[this.name][rowIndex]
        } else if (typeof rowIndex === 'string') {
          return this.form[this.name].find(item => item[this.rowKey] === rowIndex)
        }
      },
      /**
       * @desc 获取整个 table 的数据
       */
      getRowsData() {
        return this.form[this.name]
      },
      /**
       * @desc 设置一行的数据
       */
      setRowData(rowIndex, data) {
        const dataSource = this.form[this.name]
        if (typeof rowIndex === 'number') {
          dataSource.splice(rowIndex, 1, { ...dataSource[rowIndex], ...data })
        } else if (typeof rowIndex === 'string') {
          const index = dataSource.findIndex(item => item[this.rowKey] === rowIndex)
          if (index !== -1) {
            dataSource.splice(index, 1, { ...dataSource[index], ...data })
          }
        }
      },
      /**
       * @desc 新增一行的方法
       * @param {Object | Function} record 新增行的默认值
       * @param {Object} AddLineOptions 新增行的配置
       * @param {String} AddLineOptions.position 顶部添加还是末尾添加
       * @param {String} AddLineOptions.newRecordType 新增一行的方式
       */
      addEditRecord(record, AddLineOptions) {
        const { initializedRecordCreatorProps: { onlyAddOneLineAlertMessage } } = this
        const { newRecordType = 'cache' } = AddLineOptions
        const { initializedEditable: { editableKeys } } = this
        // 只能新增一行校验
        if (this.newLineRecordCache) {
          this.$message.warning(onlyAddOneLineAlertMessage)
          return
        }
        // 只能同时编辑一行校验
        if (!this.validateCanStartEdit()) {
          return
        }

        const { position = 'bottom' } = AddLineOptions
        const dataSource = this.form[this.name]
        const index = position === 'bottom' ? dataSource.length : 0
        
        const newRecord = typeof record === 'function' ? record(index, dataSource) : record
        const { rowKey } = this
        if (!newRecord[rowKey]) {
          console.error('Error: 请设置 recordCreatorProps.record 并返回一个唯一的key')
          return
        }

        const originRow = typeof record === 'function' ? record(index, dataSource) : record
        const newOriginRow = { ...originRow, [rowKey]: newRecord[rowKey] }
        this.preEditRows.set(newRecord[rowKey], newOriginRow)

        // 赋值
        if (newRecordType !== 'dataSource') {
          this.newLineRecordCache = {
            defaultValue: newOriginRow,
            options: {
              ...AddLineOptions,
              recordKey: newOriginRow[rowKey],
            },
          }
        } else {
          this.newLineRecordCache = undefined
        }

        dataSource[position === 'bottom' ? 'push' : 'unshift'](newRecord)
        
        // 更新 editableKeys
        const newKeys = [...editableKeys, newRecord[rowKey]]
        const editableRows = dataSource.filter(item => editableKeys.includes(item[rowKey]))
        const { initializedEditable: { onChange } } = this
        onChange?.(newKeys, editableRows)

        this.$nextTick(() => {
          // 如果内嵌到了 el-form 则需要清除可能存在的表单校验
          const fields = this.getValidateFields(index)
          console.log(fields)
          console.log(this.formRef)
          this.formRef?.clearValidate(fields)
        })
      },
      /**
       * @desc 内置新增一行的方法
       */
      addDefaultEditRecord() {
        const { position, newRecordType, record } = this.initializedRecordCreatorProps
        this.addEditRecord(record, { position, newRecordType })
      },
      /**
       * @desc 当前行是不是编辑状态
       * @param {Object} row 表单数据
       */
      isEditable(row) {
        const { rowKey } = this
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
      isColumnEditable(column) {
        const { nonElColumnProps: { editable, readonly } } = column
        if (readonly) {
          return false
        }

        if (typeof editable === 'function') {
          return editable(cellValue, record, scope.$index)
        }

        return true
      },
      /**
       * @desc 验证是否可以开始编辑
       * @returns {Boolean}
       */
      validateCanStartEdit() {
        const { initializedEditable: { type, editableKeys, onlyOneLineEditorAlertMessage } } = this
        if (editableKeys.length && type === 'single') {
          this.$message.warning(onlyOneLineEditorAlertMessage)
          return false
        }

        return true
      },
      onCancelEditable(recordKey) {
        this.preEditRows.delete(recordKey)
      },
      onCancel(recordKey) {
        const index = this.form[this.name].findIndex(item => item[this.rowKey] = recordKey)
        if (index !== -1) {
          this.form[this.name].splice(index, 1)
        }
        this.newLineRecordCache = undefined
      },
      onSave(recordKey) {
        if (this.newLineRecordCache.options.recordKey === recordKey) {
          this.newLineRecordCache = undefined
        }
      },
      onDelete(recordKey) {
        const index = this.form[this.name].findIndex(item => item[this.rowKey] = recordKey)
        if (index !== -1) {
          this.form[this.name].splice(index, 1)
        }
      }
    }
  }
</script>

<style scoped>
.editable-pro-table .table-head /deep/ .el-table__empty-block {
  min-height: unset;
}

.editable-pro-table /deep/ .el-form-item {
  margin: 14px 0;
}

.editable-pro-table .table-head /deep/ .el-table__empty-text {
  width: 100%;
  line-height: unset;
}

.editable-pro-table /deep/ .el-form-item__content .el-select,
.editable-pro-table /deep/ .el-form-item__content .el-input-number,
.editable-pro-table /deep/ .el-form-item__content .el-date-editor,
.editable-pro-table /deep/ .el-form-item__content .el-cascader {
  width: 100%;
}
</style>

<!-- 防止外部 el-form-item 校验错误影响 -->
<style>
.el-form-item.is-error .editable-pro-table .el-input__inner {
  border-color: #DCDFE6;
}

.el-form-item.is-error .editable-pro-table .el-input__inner:focus {
  border-color: #DCDFE6;
}

.editable-pro-table .el-form-item.is-error .el-input__inner {
  border-color: #F56C6C;
}
</style>

