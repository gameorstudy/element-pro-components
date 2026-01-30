#### ProTable - 高级表格
ProTable 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。
以下是几个设计思路：
1. 列定义包含表格和表单，方便管理；
2. 表格自定义标题、内容使用 `jsx`，使代码结构更清晰；
3. 支持列设置，增加表格功能。

![Template](../ProTable/assets/template.png "template")
<font color="#f56c6c">图片来源 antd pro table</font>
#### 何时使用
当你的表格需要与服务端进行交互或者需要多种单元格样式时，ProTable 是不二选择。
#### API
ProTable 在 el-table 和 el-form 上进行了一层封装，支持了一些预设。这里只列出与 el-table 不同的 API。
##### ProTable Attributes
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>search</td>
    <td>搜索表单，传入对象时为搜索表单的配置</td>
    <td><code>boolean | searchConfig</code></td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td>className</td>
    <td>组件内 el-table 的类名</td>
    <td><code>string</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>defaultData</td>
    <td>el-table 的默认数据</td>
    <td><code>Array</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>dataSource</td>
    <td>el-table 的数据</td>
    <td><code>Array</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>loading</td>
    <td>表格数据请求加载状态</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>total</td>
    <td>数据总条数</td>
    <td><code>number</code></td>
    <td><code>0</code></td>
  </tr>
  <tr>
    <td>tableProps</td>
    <td>el-table attributes 的配置</td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/table#table-attributes" target="_blank">TableProps</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>tableEvents</td>
    <td>el-table events 的配置，默认添加了 <code>sort-change</code> 事件</td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/table#table-events" target="_blank">TableEvents</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>columns</td>
    <td>列定义</td>
    <td><code>columnsConfig</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>paginationProps</td>
    <td>el-pagination attributes 的配置</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/pagination#attributes" target="_blank">PaginationProps</a></td>
    <td><code>defaultPaginationProps</code></td>
  </tr>
  <tr>
    <td>initialValues</td>
    <td>表单默认值</td>
    <td><code>object</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>defaultSize</td>
    <td>默认的 size</td>
    <td><code>medium | small | mini</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>manualRequest</td>
    <td>是否需要手动触发首次请求。配置为 <code>true</code> 时不可隐藏搜索表单</td>
    <td><code>boolean</code></td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td>columnSettings</td>
    <td>列设置</td>
    <td><code>boolean | columnSettingsConfig</code></td>
    <td><code>true</code></td>
  </tr>
</table>

##### ProTable Events
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>onParams</td>
    <td><code>查询</code>、<code>重置</code>、<code>分页</code>、<code>排序</code> 触发，获取到参数</td>
    <td><code>(params)=>Promise&lt;void&gt; | void</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>onSubmit</td>
    <td>提交表单时触发</td>
    <td><code>(params)=>void</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>onReset</td>
    <td>重置表单时触发</td>
    <td><code>()=>void</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>onCollapse</td>
    <td>展开、收起搜索表单</td>
    <td><code>(collapsed: boolean)=>void</code></td>
    <td>-</td>
  </tr>
</table>

##### ProTable Methods
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>reload</td>
    <td>刷新，接收一个参数：是否重置页码，<code>resetPageIndex</code> 默认 <code>true</code></td>
    <td><code>(resetPageIndex: boolean)=>void</code></td>
    <td>-</td>
  </tr>
</table>

##### 标题栏 slot
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>-</td>
    <td>高级筛选栏 和 表格区域之间的区域</td>
  </tr>
</table>

##### searchConfig
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>searchText</td>
    <td>查询按钮的文本</td>
    <td><code>string</code></td>
    <td><code>查询</code></td>
  </tr>
  <tr>
    <td>resetText</td>
    <td>重置按钮的文本</td>
    <td><code>string</code></td>
    <td><code>重置</code></td>
  </tr>
  <tr>
    <td>labelWidth</td>
    <td>标签的宽度</td>
    <td><code>string</code></td>
    <td><code>80px</code></td>
  </tr>
  <tr>
    <td>labelPosition</td>
    <td>标签的位置</td>
    <td><code>left | right</code></td>
    <td><code>right</code></td>
  </tr>
  <tr>
    <td>rowProps</td>
    <td>el-row attributes 的配置</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/layout#row-attributes" target="_blank">RowProps</a></td>
    <td>{ gutter: 8 }</td>
  </tr>
  <tr>
    <td>colProps</td>
    <td>el-col attributes 的配置</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/layout#col-attributes" target="_blank">ColProps</a></td>
    <td><code>defaultColConfig</code></td>
  </tr>
  <tr>
    <td>className</td>
    <td>组件内 el-form 的类名</td>
    <td><code>string</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>defaultCollapsed</td>
    <td>默认是否收起</td>
    <td><code>boolean</code></td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td>collapsed</td>
    <td>是否收起</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>defaultExpandedRows</td>
    <td>默认展开的行数</td>
    <td><code>number</code></td>
    <td><code>2</code></td>
  </tr>
</table>

##### defaultColConfig
```
const defaultColConfig = {
  xs: 24, // <768px
  sm: 24, // >=768px
  md: 12, // >=992px
  lg: 8,  // ≥1200px
  xl: 6,  // ≥1920px
};
```

##### columnsConfig 列定义
在 <a href="https://element.eleme.io/2.15/#/zh-CN/component/form#form-item-attributes" target="_blank">el-table-column attributes</a> 和 <a href="../ProForm/api.md#formitemsconfig" target="_blank">ProForm formItemsConfig</a> 的基础上，新增了以下 API。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>formItemProps</td>
    <td>el-form-item attributes 的配置。<code>rules</code> 配置不生效</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/form#form-item-attributes" target="_blank">FormItemProps</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>order</td>
    <td>查询表单中的权重，权重大排序在前</td>
    <td><code>number</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>hideInSearch</td>
    <td>在查询表单中不展示此项</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>hideInTable</td>
    <td>在 <code>el-table</code> 中不展示此项</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>renderCellHeader</td>
    <td>自定义表格标题</td>
    <td><code>()=>jsx</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>renderCell</td>
    <td>自定义表格内容</td>
    <td><code>(scope)=>jsx</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>disabled</td>
    <td>控制当前列在列设置面板中是否可被勾选</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>key</td>
    <td>在列设置中，若未指定 <code>prop</code> 字段，则默认使用 <code>key</code> 作为唯一标识符。同时也是组件的 <code>key</code></td>
    <td><code>string</code></td>
    <td>-</td>
  </tr>
</table>

> 如果列表和表单的 <code>prop</code> 是同一个，则只需要配置列表的 <code>prop</code> 字段。同理 <code>label</code> 字段。

> `valueType` 设置为 `option` 表示操作栏，可以不指定。

> ProForm formItemsConfig 中 `hideInForm` 属性不生效。如果要隐藏表单项，请使用 `hideInSearch` 属性。

> ProForm formItemsConfig 中 `colProps` 属性和 `slot` 基于组件设计不再支持。

> ProForm formItemsConfig 中 `valueEnum` 属性在列表中会自动回显 `label` 值。

##### PaginationConfig
在 <a href="https://element.eleme.io/2.15/#/zh-CN/component/pagination#attributes" target="_blank">el-pagination attributes</a> 的基础上，新增了以下 API。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>pageKey</td>
    <td>页码字段</td>
    <td><code>string</code></td>
    <td><code>pageNum</code></td>
  </tr>
  <tr>
    <td>sizeKey</td>
    <td>页数字段</td>
    <td><code>string</code></td>
    <td><code>pageSize</code></td>
  </tr>
</table>

> 如果想全局配置这两个字段，请使用 `Vue.extends` 插入 `props`。<font color="#f56c6c">组件封装则会导致自定义表单元素失效</font>。

##### defaultPaginationProps
```
{
  "page-sizes": [10, 20, 30, 50],
  layout: "total, sizes, prev, pager, next, jumper",
  "hide-on-single-page": true,
}
```

