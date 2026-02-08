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
              <custom-render :render="() => column.nonElColumnProps.renderCellHeader(scope)" />
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
        :data="dataSource"
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
            <custom-render :render="() => column.nonElColumnProps.renderCellHeader(scope)" />
            <!-- end -->
          </template>
          <template #default="scope">
            <!-- 操作栏 -->
            <!-- start -->
            <template v-if="column.nonElColumnProps.valueType === 'option'">
              <RenderOption
                :render="(action) => column.nonElColumnProps.renderCell(
                  scope.row,
                  scope.$index,
                  action
                )"
                :action="{ validateCanStartEdit }"
                :dataSource="dataSource"
                :row="scope.row"
                :rowKey="rowKey"
                :recordCreatorProps="initializedRecordCreatorProps"
                :editable="initializedEditable"
                :isEditable="isEditable(scope.row)"
                :isNewLineRecordCache="newLineRecordCache?.options.recordKey === scope.row[rowKey]"
                @cancel="onCancel"
                @save="onSave"
                @delete="onDelete"
              />
            </template>
            <!-- end -->
            <!-- 可编辑元素栏 -->
            <!-- start -->
            <template v-else>
              <!-- pro-form-item -->
              <!-- start -->
              <ProFormItem
                v-if="isEditable(scope.row)"
                :formItemProp="`${name}.${scope.$index}.${column.prop}`"
                :formItem="formItems[index]"
                :form="scope.row"
              />
              <!-- end -->
              <!-- 文本 -->
              <!-- start -->
              <CellView v-else :column="column" :formItem="formItems[index]" :scope="scope" />
              <!-- end -->
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
  import ProFormItem from '@/components/ProFormItem'
  import RenderOption from './components/RenderOption.vue'
  import RecordCreatorButton from './components/RecordCreatorButton.vue'
  import CellView from './components/CellView.vue'
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'  
  import { generateCryptoUID } from '@/utils/uid'


  export default {
    name: 'EditableProTable',
    components: {
      CustomRender,
      ProFormItem,
      RenderOption,
      RecordCreatorButton,
      CellView
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
        type: String
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
          return this.dataSource.length >= maxLength
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
              key,
              ...keys
            } = col
            return {
              ...keys,
              nonElColumnProps: {
                valueType,
                renderCellHeader,
                renderCell,
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
        dataSource: this.value, // 表格数据
        cachedOptions: {}, // 下拉数据 { [prop]: data }
        tableKey: 1, // table key
        newLineRecordCache: null, // newRecordType: cache 的新增记录
      }
    },
    watch: {
      // 监听元数据变化
      value(newValue) {
        this.dataSource = newValue
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
      /**
       * @desc 获取 table ref
       */
      getTableRef() {
        return this.$refs.tableRef
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
        const { dataSource } = this
        const index = position === 'bottom' ? dataSource.length : 0
        const newRecord = typeof record === 'function' ? record(index, dataSource) : record
        const { rowKey } = this
        if (!newRecord[rowKey]) {
          console.error('Error: 请设置 recordCreatorProps.record 并返回一个唯一的key')
          return
        }

        // 赋值
        if (newRecordType !== 'dataSource') {
          this.newLineRecordCache = {
            defaultValue: newRecord,
            options: {
              ...AddLineOptions,
              recordKey: newRecord[rowKey],
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
      onCancel(recordKey) {
        const index = this.dataSource.findIndex(item => item[this.rowKey] = recordKey)
        if (index !== -1) {
          this.dataSource.splice(index, 1)
        }
        this.newLineRecordCache = undefined
      },
      onSave(recordKey) {
        if (this.newLineRecordCache.options.recordKey === recordKey) {
          this.newLineRecordCache = undefined
        }
      },
      onDelete(recordKey) {
        const index = this.dataSource.findIndex(item => item[this.rowKey] = recordKey)
        if (index !== -1) {
          this.dataSource.splice(index, 1)
        }
      }
    }
  }
</script>

<style scoped>
.editable-pro-table .table-head /deep/ .el-table__empty-block {
  min-height: unset;
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
