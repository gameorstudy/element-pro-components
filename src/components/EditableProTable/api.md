#### EditableProTable - 可编辑表格
可编辑表格 EditableProTable 与 ProTable 的功能基本相同，为了方便使用 EditableProTable 增加了一些预设，关掉了查询表单和操作栏。
以下是几个设计思路：
1. 为保证数据流结构简单，可编辑表格默认不内置 el-form，因为使用了 el-form-item，所以使用时必须要嵌在 el-form 内；
2. 延用 antd 设计支持受控和非受控两种模式；
3. 新建一行按钮 recordCreatorProps.position 设置为 top 时，此时表头和表体是两张表，属性是绑定在表体的那张表上，如果遇到要求只使用一张表的情况，可以设置 recordCreatorProps: false 自定义新建一行按钮。

#### API
EditableProTable 在 el-table 上进行了一层封装，支持了一些预设。这里只列出与 el-table 不同的 API。
##### EditableProTable Attributes
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>value</td>
    <td>同 dataSource，传入一个数组，是 table 渲染的元数据</td>
    <td><code>T[]</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td>recordCreatorProps</td>
    <td>新建一行数据的相关配置</td>
    <td>
      <code>boolean | RecordCreatorProps</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>maxLength</td>
    <td>最大的行数，到达最大行数新建按钮会自动消失</td>
    <td>
      <code>number</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>editable</td>
    <td>可编辑表格的相关配置</td>
    <td>
      <code>TableRowEditable</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>controlled</td>
    <td>是否受控</td>
    <td>
      <code>boolean</code>
      </td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td>rowKey</td>
    <td>el-table 的 row-key 属性</td>
    <td>
      <code>string</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>name</td>
    <td>el-form 绑定的 key, 需要校验表单时必填</td>
    <td>
      <code>string</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>className</td>
    <td>组件内 el-table 的类名</td>
    <td>
      <code>string</code>
      </td>
    <td>-</td>
  </tr>
  <tr>
    <td>loading</td>
    <td>表格数据请求加载状态</td>
    <td><code>boolean</code></td>
    <td>-</td>
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
    <td>el-table events 的配置
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
    <td>defaultSize</td>
    <td>默认的 size</td>
    <td><code>medium | small | mini</code></td>
    <td>-</td>
  </tr>
</table>

##### EditableProTable Events
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>onChange</td>
    <td>受控时触发，支持 v-model 语法</td>
    <td><code>(value: T[]) => void</code></td>
    <td>-</td>
  </tr>
</table>

##### EditableTable Methods
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 320px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>getTableRef</td>
    <td>获取 el-table 的 ref</td>
    <td><code>() => ref</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>addEditRecord</td>
    <td>新增一行的方法</td>
    <td><code>(record, { position: RecordCreatorProps.position, newRecordType: RecordCreatorProps.newRecordType }) => void</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>getRowData</td>
    <td>获取一行数据</td>
    <td><code>(rowIndex: string | number) => T | undefined</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>getRowsData</td>
    <td>获取整个 table 的数据</td>
    <td><code>() => T[] | undefined</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>setRowData</td>
    <td>设置一行的数据</td>
    <td><code>(rowIndex: string | number, data: Partial<T>) => void</code></td>
    <td>-</td>
  </tr>
</table>

```
/**
  * 获取一行数据
  * @param rowIndex
  * @returns T | undefined
  *
  * @example getRowData(1)  可以传入第几行的数据
  * @example getRowData("id")  也可以传入 rowKey，根据你列的唯一key 来获得。
  */
getRowData?: (rowIndex: string | number) => T | undefined;
/**
  * 获取整个 table 的数据
  * @returns T[] | undefined
  */
getRowsData?: () => T[] | undefined;
/**
  * 设置一行的数据，会将数据进行简单的 merge
  *
  * {title:"old", decs:"old",id:"old"} -> set {title:"new"} -> {title:"new", decs:"old",id:"old"}
  *
  * @description 只会做最第一层对象的 merge 哦。
  * {title:"old", decs:{name:"old",key:"old"},id:"old"} -> set {decs:{name:"new"}} -> {title:"old", decs:{name:"new"},id:"old"} -> set {decs:{name:"old"}}
  *
  * @param rowIndex
  * @param data
  * @returns void
  *
  * 根据行号设置
  * @example setRowData(1, { title:"new" })  可以传入修改第几行
  *
  * 根据行 id 设置
  * @example setRowData("id", { title:"new" })  也可以传入 rowKey，根据你列的唯一 key 来设置。
  *
  * 清空原有数据
  * @example setRowData(1, { title:undefined })
  *
  */
setRowData?: (rowIndex: string | number, data: Partial<T>) => void;
```

##### toolbarRender slot
用于自定义按钮
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>-</td>
    <td>工具栏</td>
  </tr>
</table>

##### RecordCreatorProps
为了使用，预设了一个新建的功能，大多数情况下已经可以满足大部分新建的需求。与 Pro 系列组件的 API 相同，`recordCreatorProps: false` 就可以关掉按钮。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 400px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>position</td>
    <td>顶部添加还是末尾添加</td>
    <td><code>top | bottom</code></td>
    <td><code>bottom</code></td>
  </tr>
  <tr>
    <td>newRecordType</td>
    <td>新增一行的方式，默认是缓存，取消后就会消失，设置为 dataSource，取消后也不会消失，只能删除</td>
    <td><code>dataSource | cache</code></td>
    <td><code>cache</code></td>
  </tr>
  <tr>
    <td>onlyAddOneLineAlertMessage</td>
    <td>只能同时新增一行的提示，<code>newRecordType</code> 设置 <code>cache</code> 时会校验</td>
    <td><code>string</code></td>
    <td><code>只能新增一行</code></td>
  </tr>
  <tr>
    <td>record</td>
    <td>新增行的默认值</td>
    <td><code>DataSourceType
    | ((index: number, dataSource: DataSourceType[]) =>  DataSourceType)</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>creatorButtonText</td>
    <td>设置按钮文案</td>
    <td><code>string</code></td>
    <td><code>添加一行数据</code></td>
  </tr>
  <tr>
    <td>style</td>
    <td>按钮的样式设置，可以设置按钮是否显示，这样可以做最大行限制和最小行限制之类的功能</td>
    <td><code>object</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>buttonProps</td>
    <td>el-button 的属性</td>
    <td><a href="https://element.eleme.cn/#/zh-CN/component/button#attributes" target="_blank">ButtonProps</a></td>
    <td>-</td>
  </tr>
</table>

/**
record 用法
```
/**
 * @desc 新增行的默认值
 * @param {number} index 当前插入位置的索引 如果向上插入则为 0
 * @param {DataSourceType[]} dataSource 当前表格的完整数据源
 */
record: (index: number, dataSource: DataSourceType[]) => {
  return { /* 新行默认值 */ };
}
```

新增一行的时候要保证 recordCreatorProps.record key 唯一，不然会导致编辑出错。
```
<EditableProTable
  rowKey="id"
  :recordCreatorProps={
    // 每次新增的时候需要Key
    record: () => ({ id: getNewId() }),
  }
/>
```

##### TableRowEditable
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 400px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>可编辑表格的类型，单行编辑或者多行编辑</td>
    <td><code>single | multiple</code></td> 
    <td><code>single</code></td>
  </tr>
  <tr>
    <td>editableKeys</td>
    <td>正在编辑的行，受控属性。 默认 <code>key</code> 会使用 <code>rowKey</code> 的配置，如果没有配置会使用 <code>index，建议使用</code> rowKey</td>
    <td><code>Key[]</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>onChange</td>
    <td>行数据被修改的时候触发</td>
    <td><code>(editableKeys: Key[], editableRows: T[]) => void</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>onSave</td>
    <td>保存一行的时候触发</td>
    <td><code>(key: Key, row: T, originRow:T, newLine?:LineConfig) => Promise&lt;any&gt;</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>saveText</td>
    <td>保存一行的文字</td>
    <td><code>string</code></td>
    <td><code>保存</code></td>
  </tr>
  <tr>
    <td>onDelete</td>
    <td>删除一行的时候触发</td>
    <td><code>(key: Key, row: T) => Promise&lt;any&gt;</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>deleteText</td>
    <td>删除一行的文字</td>
    <td><code>string</code></td>
    <td><code>删除</code></td>
  </tr>
  <tr>
    <td>onCancel</td>
    <td>取消编辑一行时触发</td>
    <td><code>(key: Key, row: T, originRow:T, newLine?:LineConfig) => Promise&lt;any&gt;</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>cancelText</td>
    <td>取消编辑一行的文字</td>
    <td><code>string</code></td>
    <td><code>取消</code></td>
  </tr>
  <tr>
    <td>actionRender</td>
    <td>自定义编辑模式的操作栏</td>
    <td><code>(row: T, config: ActionRenderConfig<T>, defaultDom) => jsx[]</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>deletePopconfirmMessage</td>
    <td>删除时弹出的确认框提示消息</td>
    <td><code>string</code></td>
    <td><code>删除此项？</code></td>
  </tr>
  <tr>
    <td>onlyOneLineEditorAlertMessage</td>
    <td>只能编辑一行的的提示</td>
    <td><code>string</code></td>
    <td><code>只能同时编辑一行</td>
  </tr>
</table>

onSave & onCancel 函数中的 newLine: LineConfig 参数类型
```
LineConfig: {
  defaultValue?: T;
  options: {
    position?: 'top' | 'bottom';
    recordKey?: RecordKey;
    newRecordType?: 'dataSource' | 'cache';
  }
}
```

actionRender 中的 config: ActionRenderConfig 参数类型
```
ActionRenderConfig: {
  editableKeys?: RowEditableConfig<T>['editableKeys'];
  recordKey: RecordKey;
  index?: number; // 下标
  cancelEditable: (key: RecordKey) => void; // 结束编辑 组件内部实现
  onSave: RowEditableConfig<T>['onSave'];
  onCancel: RowEditableConfig<T>['onCancel'];
  onDelete?: RowEditableConfig<T>['onDelete'];
  deletePopconfirmMessage: RowEditableConfig<T>['deletePopconfirmMessage'];
  setEditableRowKeys: (value: React.Key[]) => void;
  newLineConfig?: LineConfig; // 同上
  deleteText?: React.ReactNode;
  cancelText?: React.ReactNode;
  saveText?: React.ReactNode;
  addEditRecord?: (row: T, options?: AddLineOptions) => boolean;
}
```

actionRender 中的 defaultDom: jsx[] 参数类型

```
// 分别对应保存，删除 和 取消按钮
const {save, cancel, delete} = defaultDom
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
    <td>el-form-item attributes 的配置</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/form#form-item-attributes" target="_blank">FormItemProps</a></td>
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
    <td><code>() => jsx</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>renderCell</td>
    <td>自定义表单</td>
    <td><code>(scope) => jsx | jsx[]</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>renderOption</td>
    <td>自定义操作栏</td>
    <td><code>(record, index, action) => jsx | jsx[]</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>editable</td>
    <td>编辑校验</td>
    <td><code>(cellValue, record, index) => boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>key</td>
    <td>组件的 <code>key</code></td>
    <td><code>string</code></td>
    <td>-</td>
  </tr>
</table>

renderOption 自定义操作栏 action 字段类型
```
action: {
  startEditable: (rowKey: React.Key) => boolean; // 开始编辑指定字段
  cancelEditable: (rowKey: React.Key) => void; // 取消编辑
  saveEditable: (rowKey: React.Key) => Promise<boolean>; // 保存编辑
  addEditRecord: (record: T) => void; // 新增一行
  editableKeys: React.Key[]; // 正在编辑的行
  isEditable: (record: T | React.Key) => boolean; // 是否在编辑状态
  actionRender: TableRowEditable.actionRender; // 自定义编辑模式的操作栏
}
```

> 表单绑定用 el-table-column 的 `prop`, 非 formItemsProps 的 `prop`。

> 操作栏需要设置 `valueType: 'option'`。

> ProForm initialValue 表单初始化值不支持，请使用 RecordCreatorProps.record 设置默认值。

> 不建议给表单添加 `label`，因此 ProForm `renderLabel` 属性也不再支持。

> ProForm formItemsConfig 中 `hideInForm` 属性不再支持。

> ProForm formItemsConfig 中 `colProps` 属性和 `slot` 基于组件设计不再支持。

> ProForm formItemsConfig 中 `valueEnum` 属性在列表中会自动回显 `label` 值。

> el-table 的 formatter 在查看态（文本）时生效。
