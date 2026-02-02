<template>
  <div class="pro-table">
    <!-- 搜索表单 -->
    <!-- start -->
    <template v-if="search">
      <el-form
        class="pro-table__form"
        :label-width="searchProps.labelWidth"
        :label-position="searchProps.labelPosition"
        :model="form"
        :size="defaultSize"
        :class="searchProps.className"
      >
        <!-- 栅格化布局 -->
        <!-- start -->
        <el-row v-bind="searchProps.rowProps">
          <el-col
            v-for="(item, index) in formItems"
            v-bind="searchProps.colProps"
            :style="{ display: index >= searchCount ? 'none' : '' }"
            :key="item.prop"
          >
            <!-- pro-form-item -->
            <!-- start -->
            <ProFormItem :formItem="item" :form="form">
              <template #[item.prop]="scope">
                <slot :name="item.prop" v-bind="scope" />
              </template>
            </ProFormItem>
            <!-- end -->
          </el-col>
          <!-- button -->
          <!-- start -->
          <el-col v-bind="searchColConfig" align="right" key="search">
            <el-form-item>
              <el-button icon="el-icon-refresh" @click="handleReset">{{ searchProps.resetText }}</el-button>
              <el-button
                type="primary"
                icon="el-icon-search"
                :loading="loading"
                @click="handleSearch"
                >{{ searchProps.searchText }}</el-button
              >
              <template v-if="showExpandToggle">
                <a class="btn-collapse" @click="handleCollapse">
                  {{ collapsed ? "展开" : "收起" }}
                  <ArrowIcon
                    style="margin-inline-start: 5px; transition: 0.3s"
                    :style="{ transform: `rotate(${collapsed ? 0 : 0.5}turn)` }"
                  />
                </a>
              </template>
            </el-form-item>
          </el-col>
          <!-- end -->
        </el-row>
      </el-form>
    </template>
    <!-- end -->
    <!-- 标题栏 -->
    <!-- start -->
    <div v-if="$slots.default || columnSettings" class="pro-table__toolbar">
      <slot></slot>
      <!-- 列设置 -->
      <!-- start -->
      <div v-if="columnSettings" class="pro-table__toolbar-items">
        <ColumnSettings :columns="settingColumns" :columnSettings="initializedColumnSettings" />
      </div>
      <!-- end -->
    </div>
    <!-- end -->
    <el-table
      ref="tableRef"
      class="pro-table__table"
      :class="className"
      v-loading="loading"
      :data="tableData"
      v-bind="initializedTableProps"
      v-on="initializedTableEvents"
      :key="tableKey"
    >
      <el-table-column
        v-for="column in normalizedColumns"
        v-bind="{
          ...column,
          nonElColumnProps: undefined,
        }"
        :key="column.prop || column.nonElColumnProps.key"
      >
        <template v-if="column.nonElColumnProps.renderCellHeader" #header="scope">
          <!-- 覆写头部 -->
          <!-- start -->
          <custom-render :render="() => column.nonElColumnProps.renderCellHeader(scope)" />
          <!-- end -->
        </template>
        <template v-if="column.nonElColumnProps.renderCell" #default="scope">
          <!-- 自定义 render -->
          <!-- start -->
          <custom-render :render="() => column.nonElColumnProps.renderCell(scope)" />
          <!-- end -->
        </template>
        <template v-else-if="column.nonElColumnProps.valueEnum" #default="scope">
          <!-- valueEnum -->
          <!-- start -->
          <span>
            {{
              column.nonElColumnProps.valueEnum instanceof Map 
              ? column.nonElColumnProps.valueEnum.get(scope.row?.[column.prop])
              : column.nonElColumnProps.valueEnum[scope.row?.[column.prop]]
            }}
          </span>
          <!-- end -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pro-table__pagination"
      v-bind="initializedPaginationProps"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'
  import { defaultColConfig, BREAKPOINT_ORDER, GRID_COLUMNS, calculateCurrentSpan } from "@/utils/breakpoints"
  import { debounce } from "@/utils/debounce"
  import { validatePersistenceConfig } from '@/utils/validate'
  import { generateCryptoUID } from '@/utils/uid'
  import ProFormItem from '@/components/ProFormItem'
  import ArrowIcon from "./components/svg/ArrowIcon.vue"
  import CustomRender from '@/components/CustomRender'
  import ColumnSettings from './components/ColumnSettings.vue'

  export default {
    name: 'ProTable',
    components: {
      ProFormItem,
      CustomRender,
      ArrowIcon,
      ColumnSettings
    },
    provide() {
      if (!this.columnSettings) {
        return
      }

      return {
        // 监听列设置修改
        onColumnSettingsChange: this.onColumnSettingsChange,
      };
    },
    props: {
      // 搜索表单
      search: {
        type: [Boolean, Object],
        default: true
      },
      // el-table 的类名
      className: {
        type: String,
      },
      // el-table 的默认数据
      defaultData: {
        type: Array,
        default: () => []
      },
      // el-table 的数据
      dataSource: {
        type: Array
      },
      // 表格数据请求加载状态
      loading: {
        type: Boolean
      },
      // 数据总条数
      total: {
        type: Number,
        default: 0
      },
      // el-table attributes 的配置
      tableProps: {
        type: Object,
        default: () => ({})
      },
      // el-table events 的配置
      tableEvents: {
        type: Object,
        default: () => ({})
      },
      // 列定义
      columns: {
        type: Array,
        required: true,
        default: () => []
      },
      // el-pagination attributes 的配置
      paginationProps: {
        type: Object,
        default: () => ({})
      },
      // 分页参数字段映射配置
      paginationMapping: {
        type: Object,
        default: () => ({})
      },
      // 表单默认值
      initialValues: {
        type: Object,
        default: () => ({})
      },
      // 默认的 size
      defaultSize: {
        type: String,
        validator: function (value) {
          return ['medium', 'small', 'mini'].includes(value);
        },
      },
      // 是否需要手动触发首次请求
      manualRequest: {
        type: Boolean,
        default: false
      },
      // 列设置
      columnSettings: {
        type: [Boolean, Object],
        default: true
      }
    },
    computed: {
      // search 初始化
      searchProps() {
        const { search } = this;
        if (search) {
          const defaultSearch = {
            searchText: "查询",
            resetText: "重置",
            labelWidth: "80px",
            rowProps: {
              gutter: 8,
            },
            colProps: defaultColConfig,
            collapsed: true, // 默认收起
            defaultExpandedRows: 2,
          };

          if (typeof search === "object") {
            return {
              ...defaultSearch,
              ...this.search,
              collapsed: search.collapsed ?? search.defaultCollapsed ?? defaultSearch.collapsed,
            };
          }

          return {
            ...defaultSearch,
          };
        }

        return false
      },
      // 表单项
      formItems() {
        const { columns } = this;
        return (
          columns
            // 过滤 隐藏的 & 无表单类型的 & 操作栏
            .filter((item) => !item.hideInSearch && !!item.valueType && item.valueType !== 'option')
            // 权重大排序在前
            .sort((a, b) => b.order - a.order)
            // 筛选
            .map((col) => {
              const {
                label,
                prop,
                formItemProps = {},
                valueType,
                fieldProps = {},
                fieldEvents,
                initialValue,
                renderLabel,
              } = col;
              // 设置 el-form-item
              formItemProps.label = formItemProps.label || label;
              formItemProps.prop = formItemProps.prop || prop;

              // 设置 placeholder
              setPlaceholder(fieldProps, valueType);

              // 设置 select options
              setSelectOptions(col, this.cachedOptions);

              // 设置 cascader options
              setCascaderOptions(fieldProps, col, this.cachedOptions);

              return {
                ...formItemProps,
                valueType,
                fieldProps,
                fieldEvents,
                options: col.options,
                initialValue,
                renderLabel,
              };
            })
        );
      },
      // 表单项总个数
      totalSearchCount() {
        return this.formItems.length
      },
      // 标准化列定义配置
      normalizedColumns() {
        const { columns, initializedColumnSettings, columnSettingsRule } = this
        let normalizedColumns = columns
          // 筛选隐藏项
          .filter(item => !item.hideInTable)
          .map((col) => {
            // 筛选 el-column 属性
            const {
              formItemProps,
              valueType,
              fieldProps,
              fieldEvents,
              options,
              valueEnum,
              optionLoader,
              initialValue,
              renderLabel,
              order,
              hideInSearch,
              renderCellHeader,
              renderCell,
              disabled,
              key,
              ...keys
            } = col
            return { 
              ...keys,
              nonElColumnProps: {
                valueEnum,
                renderCellHeader,
                renderCell,
                key,
                disabled
              }
            }
          })

        // 列设置处理
        const { draggable, checkable } = initializedColumnSettings
  
        // 合并列设置规则
        if (initializedColumnSettings && columnSettingsRule?.length) {
          normalizedColumns = normalizedColumns.map(col => {
            const rule = columnSettingsRule.find(item => (col.prop || col.nonElColumnProps.key) === item.prop)
            if (rule) {
              const { checkable, fixed, index } = rule
              col.nonElColumnProps = {
                ...col.nonElColumnProps,
                checkable,
                index
              }
              return { ...col, fixed }
            }

            return col
          })
        }

        // 支持拖拽排序
        if (draggable) {
          normalizedColumns.sort((a, b) => a.nonElColumnProps.index - b.nonElColumnProps.index)
        }

        // 支持显示/隐藏列
        if (checkable) {
          normalizedColumns = normalizedColumns.filter(item => item.nonElColumnProps.checkable)
        } 

        return normalizedColumns
      },
      // 列设置的列表项
      settingColumns() {
        const { columnSettings } = this
        if (!columnSettings) {
          return []
        }
        const { columnSettingsRule, columns } = this

        return columnSettingsRule.map((rule, index) => {
            const col = columns.find(item => rule.prop === (item.prop || item.key))
            if (col) {
              const { label, disabled } = col
              return { ...rule, label, disabled }
            }

            return rule
          })
      },
      // 是否持久化
      isValidPersistence() {
        const { columnSettings } = this
        if (typeof columnSettings !== 'object') {
          return false
        }

        const { persistenceType, persistenceKey } = columnSettings
        return validatePersistenceConfig(persistenceType, persistenceKey)
      },
      // columnSettings 初始化
      initializedColumnSettings() {
        const { columnSettings } = this
        if (columnSettings) {
          const defaultColumnSettings = {
            resetText: '重置',
            settingText: '列设置',
            draggable: true,
            checkable: true
          }

          // 如果不是对象，返回默认值
          if (typeof columnSettings !== 'object') {
            return defaultColumnSettings
          }

           const { persistenceType, persistenceKey, ...restSettings } = columnSettings
  
          // 合并基本设置
          const baseSettings = {
            ...defaultColumnSettings,
            ...restSettings
          }

          // 如果没有持久化配置，直接返回
          if (!persistenceType) {
            return baseSettings
          }


          // 获取持久化
          if (this.isValidPersistence) {
            return {
              ...baseSettings,
              persistenceType,
              persistenceKey
            }
          }

          return baseSettings
        }

        return false
      },
      // tableProps 初始化
      initializedTableProps() {
        const { tableProps, defaultSize } = this
        return {
          size: defaultSize,
          ...tableProps
        }
      },
      // tableEvents 初始化
      initializedTableEvents() {
        return {
          'sort-change': this.sortChange, // 排序
          ...this.tableEvents
        }
      },
      // paginationProps 初始化
      initializedPaginationProps() {
        return {
          "page-sizes": [10, 20, 30, 50],
          layout: "total, sizes, prev, pager, next, jumper",
          "hide-on-single-page": true,
          ...this.paginationProps,
          "current-page": this.pageNum,
          "page-size": this.pageSize,
          total: this.total,
        }
      },
    },
    data() {
      return {
        cachedOptions: {}, // 下拉数据 { [prop]: data }
        form: this.initForm(), // 表单数据
        showExpandToggle: false, // 是否显示展开、收起
        searchColConfig: defaultColConfig, // search Col 配置
        collapsed: true, // 展开、收起
        searchCount: 0, // 收起展示的表单个数收起展示的表单个数
        tableData: this.defaultData, // 表格数据
        tableKey: 1, // table key
        pageNum: 1, // 页码
        pageSize: this.paginationProps["page-size"] || 10, // 页数
        columnSettingsRule: [], // 列设置规则
      }
    },
    watch: {
      // 监听表单项总个数
      totalSearchCount() {
        this.calculateSearchLayout()
      },
      // 监听 search.collapsed
      "search.collapsed": function (newValue) {
        if (newValue !== this.collapsed) {
          this.handleCollapse()
        }
      },
      // 监听表格数据
      dataSource(newVal) {
        this.tableData = newVal
      },
    },
    created() {
      // 获取异步数据
      this.getOptions()
      // 是否手动执行
      if (!this.manualRequest) {
        this.handleSearch()
      }
      // 开启列设置
      if (this.columnSettings) {
        const data = this.initializeColumnSettingsRule()
        this.columnSettingsRule = data
        // 存储副本（防止对象引用）
        this.resetRules = JSON.parse(JSON.stringify(data))
      }
    },
    mounted() {
      // 是否支持响应式
      const isResponsive = this.isResponsive()
      // 计算是否需要展开、收起以及位置
      this.calculateSearchLayout(isResponsive)

      // 监听 window 宽度变化
      if (isResponsive) {
        // window 宽度变化防抖
        this.debounceResize = debounce(this.resize)
        // 监听 window resize
        window.addEventListener("resize", this.debounceResize)
      }
    },
    methods: {
      /**
       * @desc 获取异步下拉数据
       */
      getOptions() {
        const { columns } = this;
        for (const column of columns) {
          const { prop, fieldProps = {}, optionLoader } = column;
          if (optionLoader && typeof optionLoader === "function") {
            optionLoader().then((res) => {
              const key = fieldProps.prop || prop;
              this.cachedOptions = {
                ...this.cachedOptions,
                [key]: res,
              };
            });
          }
        }
      },
      /**
       * @desc 初始化表单数据
       */
      initForm() {
        const { columns } = this;
        // 兼容
        if (!columns.length) {
          return {};
        }

        const data = columns
          // 筛选表单类型
          .filter((item) => !!item.valueType && item.valueType !== 'option')
          .reduce((accu, cur) => {
            const { prop, fieldProps = {}, initialValue } = cur;
            const key = fieldProps.prop || prop;
            return {
              ...accu,
              [key]: initialValue,
            };
          }, {})

        return { ...this.initialValues, ...data }
      },
      /**
       * @desc 是否需要支持响应式
       * @returns {boolean}
       */
      isResponsive() {
        const { searchProps: { colProps } } = this;
        const keys = Object.keys(colProps)
        return keys.some((key) => BREAKPOINT_ORDER.includes(key))
      },
      /**
       * @desc 计算搜索区域的布局配置（展开/收起状态）
       * @param {boolean} isResponsive 是否是响应式
       */
      calculateSearchLayout(isResponsive = false) {
        const { searchProps: { colProps, defaultExpandedRows }, totalSearchCount } = this

        // 1. 计算每个表单项所占的栅格跨度
        this.cachedSpanPerField = isResponsive 
          ? calculateCurrentSpan(colProps) 
          : (colProps.span || 8)

        // 2. 计算最大可展示的表单项数量
        this.maxVisibleFields = Math.floor(
          (GRID_COLUMNS / this.cachedSpanPerField) * defaultExpandedRows
        ) - 1

        // 3. 判断是否需要显示展开/收起按钮
        this.showExpandToggle = totalSearchCount > this.maxVisibleFields

        if (this.showExpandToggle) {
          this.collapsed = this.searchProps.collapsed
        }
        
        // 4. 更新布局配置
        this.updateSearchLayout()
      },
      /**
       * @desc 更新搜索按钮的位置
       */
      updateSearchLayout() {
        const { searchProps: { colProps }, cachedSpanPerField } = this

        // 1. 计算可见的表单项数量
        this.searchCount = this.showExpandToggle && this.collapsed
          ? this.maxVisibleFields
          : this.totalSearchCount

        // 2. 计算搜索按钮的位置
        const restSpan = GRID_COLUMNS - ((cachedSpanPerField * this.searchCount) % GRID_COLUMNS)

        // 3. 计算偏差值 offset
        const offset = restSpan - cachedSpanPerField

        this.searchColConfig = { ...colProps, offset }
      },
      /**
       * @desc 宽度变化
       * @param {Array} entries 监听元素数据
       */
      resize() {
        // 重新计算
        this.calculateSearchLayout(true)
      },
      /**
       * @desc 点击展开、收起
       */
      handleCollapse() {
        this.collapsed = !this.collapsed
        this.$emit("onCollapse", this.collapsed)
        if (this.showExpandToggle) {
          // 更新展开、收起的位置
          this.updateSearchLayout()
        }
      },
      /**s
       * @desc 表单请求参数（分页）
       */
      getParams() {
        const { pageNum, pageSize, paginationMapping: { pageKey, sizeKey } } = this
        return {
          ...this.form,
          [pageKey || "pageNum"]: pageNum,
          [sizeKey || "pageSize"]: pageSize,
        }
      },
      /**
       * @desc 重置
       */
      handleReset() {
        this.form = this.initForm()
        // 重置第一页
        this.pageNum = 1
        this.$emit("onParams", this.getParams())
        this.$emit("onReset")
      },
      /**
       * @desc 查询
       */
      handleSearch() {
        // 重置第一页
        this.pageNum = 1
        const params = this.getParams()
        this.$emit("onParams", params)
        this.$emit("onSubmit", params)
      },
      /**
       * @desc 刷新
       * @param {boolean} resetPageIndex 是否重置页码
       */
      reload(resetPageIndex = true) {
        if (resetPageIndex) {
          this.pageNum = 1
        }

        this.$emit("onParams", this.getParams())
      },
      /**
       * @desc 排序
       * @param {String} prop 属性
       * @param {String} order 升序: ASC 倒序: DESC
       */
      sortChange({ prop, order }) {
        // 重置第一页
        this.pageNum = 1
        this.$emit("onParams", { ...this.getParams(), prop, order })
      },
      /**
       * @desc 监听页码修改
       * @param {Number} page 页码
       */
      handleCurrentChange(page) {
        this.pageNum = page
        this.$emit("onParams", this.getParams())
      },
      /**
       * @desc 监听页数修改
       * @param {Number} pageSize 页数
       */
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        // 重置页码（防止组件会自动计算页码 可能在 nextTick 后执行 current-change 事件）
        this.pageNum = 1

        this.$emit("onParams", this.getParams())
      },
      /**
       * @desc 初始化列设置
       */
      initializeColumnSettingsRule() {
        const { persistenceType, persistenceKey } = this.columnSettings
        
        // 从缓存读取
        if (this.isValidPersistence) {
          const data = JSON.parse(window[persistenceType]?.getItem(persistenceKey))
          if (Array.isArray(data)) {
            return data
          }
        }

        // Columns 渲染生成
        return this.columns
          // 过滤隐藏的 && (columnConfig.prop || columnConfig.key)
          .filter((item) => !item.hideInTable && (item.prop || item.key))
          .map((col, index) => {
            const { prop, key, fixed } = col;
            return {
              prop: prop || key,
              fixed,
              checkable: true,
              index,
            }
          })
      },
      /**
       * @desc 全选、取消全选
       * @param {Boolean} checked 勾选状态
       */
      checkAllRule(checked) {
        this.columnSettingsRule = this.columnSettingsRule.map(rule => {
          const col = this.columns.find(item => (item.prop || item.key) === rule.prop )
          if (col) {
            return { ...rule, checkable: !col.disabled ? checked : rule.checkable }
          }

          return rule
        })
      },
      /**
       * @desc 单个勾选、取消勾选
       * @param {String} prop 标识
       * @param {Boolean} checked 勾选状态
       */
      checkRule(prop, checked) {
        const { columnSettingsRule } = this
        const index = columnSettingsRule.findIndex((item) => item.prop === prop)
        if (index !== -1) {
          columnSettingsRule.splice(index, 1, {
            ...columnSettingsRule[index],
            checkable: checked,
          })
        }
      },
      /**
       * @desc 固定位置修改
       * @param {String} prop 属性
       * @param {String | undefined} fixed 固定位置
       */
      handleAlignRule(prop, fixed) {
        const { columnSettingsRule } = this
        const index = columnSettingsRule.findIndex((item) => item.prop === prop)
        if (index !== -1) {
          const rule = columnSettingsRule[index]
          columnSettingsRule.splice(index, 1, { ...rule, fixed })
        }
      },
      /**
       * @desc 重置列设置规则
       */
      handleResetRule() {
        // 回溯到初始化的副本（防止引用）
        this.columnSettingsRule = JSON.parse(JSON.stringify(this.resetRules))
      },
      /**
       * @desc 拖拽更新
       * @param {String} fromProp 拖拽开始列
       * @param {String} toProp 释放目标列
       * @param {Boolean} isAfter 是否拖拽到分组的最后一列
       */
      handleDropRule(fromProp, toProp, isAfter = false) {
        const { columnSettingsRule } = this
        const fromIndex = columnSettingsRule.findIndex(item => (item.prop || item.key) === fromProp)
        if (fromIndex === -1) {
          return
        }
        const toIndex = columnSettingsRule.findIndex(item => (item.prop || item.key) === toProp)
        if (toIndex === -1) {
          return
        }
        // 向上拖拽
        const isUp = fromIndex > toIndex
        // 开始移动下标
        const startIndex = isUp ? toIndex : fromIndex + 1
        // 结束移动下标
        const endIndex = isUp ? fromIndex : isAfter ? toIndex + 1 : toIndex
        // 移动
        for (let i = startIndex; i < endIndex; ++i) {
          const column = columnSettingsRule[i]
          columnSettingsRule.splice(i, 1, { ...column, index: isUp ? column.index + 1 : column.index - 1 })
        }

        const fromColumn = columnSettingsRule[fromIndex]
        if (isUp) {
          // 先删除 后插入
          columnSettingsRule.splice(fromIndex, 1)
          columnSettingsRule.splice(toIndex, 0, { ...fromColumn, index: toIndex })
        } else {
          // 先插入 后删除
          columnSettingsRule.splice(toIndex, 0 , { ...fromColumn, index: toIndex })
          columnSettingsRule.splice(fromIndex, 1)
        }
      },
      /**
       * @desc el-table 列的数量发生变化时需要重新布局
       */
      doLayout() {
        this.$nextTick(() => {
          // 对 Table 进行重新布局
          this.$refs.tableRef?.doLayout()
        })
      },
      /**
       * @desc 监听列设置修改
       * @param { Object } data 数据
       * @param {String} data.event 事件类型
       */
      onColumnSettingsChange(data) {
        const { event, prop, checked, fixed, fromProp, toProp, isAfter } = data;
        // 勾选或取消勾选
        switch (event) {
          case "checkAll":
            this.checkAllRule(checked)
            this.doLayout()
            break
          case "check":
            this.checkRule(prop, checked)
            this.doLayout()
            break
          case "align":
            this.handleAlignRule(prop, fixed)
            break
          case "reset":
            this.handleResetRule()
            this.doLayout()
            break
          case 'drop':
            this.handleDropRule(fromProp, toProp, isAfter)
            // 更新 table key
            this.tableKey = generateCryptoUID()
            this.doLayout()
            break
          default:
            break
        }

        // 持久化
        if (this.isValidPersistence) {
          const { persistenceType, persistenceKey } = this.initializedColumnSettings
          window[persistenceType].setItem(persistenceKey, JSON.stringify(this.columnSettingsRule))
        }
      },
    },
    beforeDestroy() {
      // 清除 resize
      window.removeEventListener("resize", this.resize)
      // 取消防抖
      this.debounceResize?.cancel()
    },
  }
</script>

<style scoped>
.pro-table__form {
  padding: 24px 24px 2px;
  margin-block-end: 16px;
  background-color: #fff;
}

.pro-table__form /deep/ .el-form-item__content .el-select,
.pro-table__form /deep/ .el-form-item__content .el-input-number,
.pro-table__form /deep/ .el-form-item__content .el-date-editor,
.pro-table__form /deep/ .el-form-item__content .el-cascader {
  width: 100%;
}

.btn-collapse {
  margin-left: 16px;
  color: #409eff;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.pro-table__toolbar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
}

.pro-table__toolbar-items {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

.pro-table__pagination {
  margin: 16px 0;
  margin-block-end: 0;
  display: flex;
  justify-content: flex-end;
}
</style>
