<template>
  <div>
    <el-row>
      <el-col :md="24" :lg="6">
        <h4>验证点</h4>
        <ul>
          <li>ProTable.search</li>
          <li>searchConfig.searchText</li>
          <li>searchConfig.resetText</li>
          <li>searchConfig.labelWidth</li>
          <li>searchConfig.labelPosition</li>
          <li>searchConfig.rowProps</li>
          <li>searchConfig.colProps</li>
          <li>searchConfig.className</li>
          <li>searchConfig.defaultCollapsed</li>
          <li>searchConfig.collapsed</li>
          <li>searchConfig.defaultExpandedRows</li>
          <li>ProTable.className</li>
          <li>ProTable.defaultData</li>
          <li>ProTable.dataSource</li>
          <li>ProTable.loading</li>
          <li>ProTable.total</li>
          <li>ProTable.tableProps</li>
          <li>ProTable.tableEvents</li>
          <li>ProTable.columns</li>
          <li>ProTable.paginationProps</li>
          <li>ProTable.paginationMapping</li>
          <li>ProTable.initialValues</li>
          <li>ProTable.defaultSize</li>
          <li>ProTable.manualRequest</li>
          <li>ProTable.columnSettings = false</li>
          <li>ProTable.columnSettings.resetText</li>
          <li>ProTable.columnSettings.settingText</li>
          <li>ProTable.columnSettings.draggable</li>
          <li>ProTable.columnSettings.checkable</li>
          <li>ProTable.columnSettings.persistenceType</li>
          <li>ProTable.columnSettings.persistenceKey</li>
          <li>ProTableEvents.onParams</li>
          <li>ProTableEvents.onSubmit</li>
          <li>ProTableEvents.onReset</li>
          <li>ProTableEvents.onCollapse</li>
          <li>ProTableMethods.reload</li>
          <li>标题栏 slot</li>
          <li>columnsConfig.formItemProps</li>
          <li>columnsConfig.valueType = slot</li>
          <li>columnsConfig.renderLabel</li>
          <li>columnsConfig.order</li>
          <li>columnsConfig.hideInSearch</li>
          <li>columnsConfig.hideInTable</li>
          <li>columnsConfig.renderCellHeader</li>
          <li>columnsConfig.renderCell</li>
          <li>columnsConfig.PaginationConfig</li>
        </ul>
      </el-col>
      <el-col :md="24" :lg="18">
        <ProTable 
          ref="proTableRef"
          :search="search"
          className="demo-table"
          :defaultData="defaultData"
          :dataSource="dataSource"
          :tableProps="{
            border: true
          }"
          :tableEvents="{
            'selection-change': this.selectChange
          }"
          :loading="loading"
          :total="total"
          :columns="columns"
          :paginationProps="{
            'page-sizes': [10, 20],
          }"
          :initialValues="initialValues"
          defaultSize="small"
          :manualRequest="true"
          :columnSettings="true"
          @onParams="onParams"
          @onSubmit="onSubmit"
          @onReset="onReset"
          @onCollapse="onCollapse"
        >
          <template #title2="{ form }">
            <el-input v-model="form.title2" placeholder="自定义表单"></el-input>
          </template>
          <!-- 活动时间 -->
          <!-- start -->
          <template #datetime="{ form }">
            <el-row>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-row>
          </template>
          <!-- end -->
          <!-- 标题栏 -->
          <!-- start -->
          <span>
            <el-button type="primary" @click="collapsed = !collapsed">手动展开、收起</el-button>
            <el-button type="primary" @click="reload">手动刷新</el-button>
          </span>
          <!-- end -->
        </ProTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ProTable from '@/components/ProTable'

  const TOTAL_RECORDS = 256

  export default {
    name: 'ProTableDemo1',
    components: {
      ProTable,
    },
    computed: {
      columns() {
        return [
          {
            width: 60,
            type: 'selection',
            key: 'selection',
            disabled: true
          },
          {
            label: '标题1',
            prop: 'title1',
            valueType: 'input',
            renderLabel: () => (
              <span style="color: #f56c6c">标题1</span>
            ),
            order: 1
          },
          {
            label: '标题2',
            prop: 'title2',
            valueType: 'slot',
            renderCellHeader: () => (
              <span style="color: #f56c6c">标题2</span>
            ),
            order: 2
          },
          {
            label: '标题3',
            prop: 'title3',
            valueType: 'input',
            formItemProps: {
              label: 'new标题3'
            }
          },
          {
            label: '标题4',
            prop: 'title4',
            valueType: 'input',
            initialValue: '我有默认值'
          },
          {
            label: '标题5',
            prop: 'title5',
            valueType: 'select',
            valueEnum: {
              all: '全部',
              open: '未解决',
              close: '已解决'
            }
          },
          {
            label: '标题6',
            prop: 'title6',
            valueType: 'select',
            valueEnum: new Map([
              ['all', '全部'],
              ['open', '未解决'],
              ['close', '已解决']
            ])
          },
          {
            label: 'hideInSearch',
            prop: 'title7',
            valueType: 'input',
            hideInSearch: true
          },
          {
            label: 'hideInTable',
            prop: 'title8',
            valueType: 'input',
            hideInTable: true
          },
          {
            label: '活动时间',
            prop: 'datetime',
            valueType: 'slot',
          },
          {
            width: 120,
            label: '操作',
            valueType: 'option',
            fixed: 'right',
            renderCell: (scope) => [
              <el-button type="text">详情</el-button>,
              <el-button type="text">编辑</el-button>
            ],
            key: 'action',
          }
        ]
      },
      search() {
        return {
          searchText: '查询按钮',
          resetText: '重置按钮',
          labelWidth: '90px',
          labelPosition: 'left',
          rowProps: { gutter: 20 },
          colProps: { span: 8 },
          defaultCollapsed: false,
          className: 'search',
          defaultExpandedRows: 1,
          collapsed: this.collapsed,
        }
      }
    },
    data() {
      return {
        collapsed: undefined,
        defaultData: Array.from({ length: 4 }, (_, index) => ({
          title1: `数据1-${index}`,
          title2: `数据2-${index}`,
          title3: `数据3-${index}`,
          title4: `数据4-${index}`,
          title5: `${ index % 3 === 0 ? 'all' : index % 3 === 1 ? 'open' : 'close' }`,
          title6: `${ index % 3 === 0 ? 'all' : index % 3 === 1 ? 'open' : 'close' }`,
          title7: `数据7-${index}`,
          title8: `数据8-${index}`,
          datetime: '2026-01-01'
        })),
        dataSource: [],
        loading: false,
        total: 0,
        initialValues: {
          date1: new Date(2026, 0, 1),
          date2: Date.now()
        }
      }
    },
    methods: {
      onParams(params) {
        console.log('params', params)
        const data = Array.from({ length: TOTAL_RECORDS }, (_, index) => ({
          title1: `数据1-${index}`,
          title2: `数据2-${index}`,
          title3: `数据3-${index}`,
          title4: `数据4-${index}`,
          title5: `${ index % 3 === 0 ? 'all' : index % 3 === 1 ? 'open' : 'close' }`,
          title6: `${ index % 3 === 0 ? 'all' : index % 3 === 1 ? 'open' : 'close' }`,
          title7: `数据7-${index}`,
          title8: `数据8-${index}`,
        }))
        const { pageNum, pageSize } = params
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.dataSource = data.slice((pageNum - 1) * pageSize, pageNum * pageSize)
          this.total = TOTAL_RECORDS
        }, 1000)
      },
      onSubmit(params) {
        console.log('onSubmit', params)
      },
      onReset() {
        console.log('onReset')
      },
      onCollapse(collapsed) {
        this.collapsed = collapsed
        console.log(`我${collapsed ? '收起了' : '展开了'}`)
      },
      selectChange(rows) {
        console.log('rows', rows)
      },
      reload() {
        this.$refs.proTableRef.reload()
      }
    },
  }
</script>

<style scoped>
ul li {
  list-style-type: none;
}

ul li::before {
  content: "✓ ";
  color: green;
}

.line {
  text-align: center;
}
</style>
