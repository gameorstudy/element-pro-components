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
    <div v-if="$slots.default" class="pro-table__toolbar">
      <slot></slot>
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
      v-bind="{
        ...initializedPaginationProps,
        pageKey: undefined,
        sizeKey: undefined,
      }"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'
  import { defaultColConfig, BREAKPOINT_ORDER, GRID_COLUMNS, calculateCurrentSpan } from "@/utils/breakpoints"
  import { debounce } from "@/utils/debounce"
  import ProFormItem from '@/components/ProFormItem'
  import ArrowIcon from "./components/svg/ArrowIcon.vue"
  import CustomRender from '@/components/CustomRender'

  export default {
    name: 'ProTable',
    components: {
      ProFormItem,
      CustomRender,
      ArrowIcon,
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
        const { columns } = this
        return columns
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
                key
              }
            }
          })
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
        this.handleSearch();
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
        const keys = Object.keys(colProps);
        return keys.some((key) => BREAKPOINT_ORDER.includes(key))
      },
      /**
       * @desc 计算搜索区域是否需要展开、收起或显示的位置
       * @param {boolean} isResponsive 是否是响应式
       */
      calculateSearchLayout(isResponsive = false) {
        const { searchProps: { colProps, defaultExpandedRows }, totalSearchCount } = this
        if (isResponsive) {
          // 缓存一栏占的 span
          this.cachedSpanPerField = calculateCurrentSpan(colProps)
        } else {
          // 缓存一栏占的 span
          this.cachedSpanPerField = colProps.span || 8
        }

        // 计算最大展示的表单个数
        const maxSearchCount = (GRID_COLUMNS / this.cachedSpanPerField) * defaultExpandedRows - 1

        // 计算是否需要展开、收起
        this.showExpandToggle = totalSearchCount > maxSearchCount

        if (this.showExpandToggle) {
          // 当前是否展开
          this.collapsed = this.searchProps.collapsed

          // 缓存收起的的表单个数
          this.cachedSearchCount = maxSearchCount
        }

        // 更新展开、收起的位置
        this.updateSearchLayout()
      },
      /**
       * @desc 更新展开、收起的位置
       */
      updateSearchLayout() {
        const { searchProps: { colProps } } = this
        // 判断展开、收起的表单个数
        if (this.showExpandToggle && this.collapsed) {
          this.searchCount = this.cachedSearchCount
        } else {
          this.searchCount = this.totalSearchCount
        }

        // 计算展开、收起的剩余空间
        const restSpan = GRID_COLUMNS - ((this.cachedSpanPerField * this.searchCount) % GRID_COLUMNS)
        // 计算偏差值 offset
        const offset = restSpan - this.cachedSpanPerField
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
        const { pageNum, pageSize, paginationProps: { pageKey, sizeKey } } = this
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
  /* justify-content: space-between; */
  padding-bottom: 16px;
}

.pro-table__pagination {
  margin: 16px 0;
  margin-block-end: 0;
  display: flex;
  justify-content: flex-end;
}
</style>
