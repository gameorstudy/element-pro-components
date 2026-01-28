#### ProForm - 高级表单
ProForm 是通过配置动态生成 el-form 组件，减少模板语法，使表单开发更简单。
以下是几个设计思路：
1. ProForm 非受控，可以通过事件监听获取实时数据；
2. ProForm 自定义表单元素频繁，基于 `v-model` 语法便捷性考虑自定义渲染使用 `slot`；
3. `el-form-item` 自定义标签和提交按钮使用 `jsx`，目的是使代码结构更加清晰。
##### API
ProForm 在 el-form 上进行了一层封装，支持了一些预设。
##### ProForm Attributes
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>formProps</td>
    <td>el-form attributes 的配置</td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/form#form-attributes" target="_blank">FormProps</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>className</td>
    <td>组件内 el-form 的类名</td>
    <td>
      <code>string</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>formItems</td>
    <td>表单项配置</td>
    <td>
      <code>formItemsConfig</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>submitter</td>
    <td>提交按钮相关配置</td>
    <td>
      <code>boolean | submitterProps</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>grid</td>
    <td>开启栅格化模式，宽度默认百分比</td>
    <td>
      <code>boolean</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>rowProps</td>
    <td>开启 <code>grid</code> 模式时传递给 <code>el-row</code></td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/layout#row-attributes" target="_blank">RowProps</a>
    </td>
    <td>{ gutter: 8 }</td>
  </tr>
  <tr>
    <td>initialValues</td>
    <td>表单默认值</td>
    <td>
      <code>object</code>
    </td>
    <td>-</td>
  </tr>
</table>

##### ProForm Events
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>onFinish</td>
    <td>提交表单且数据验证成功后回调事件</td>
    <td>
      <code>(values)=>Promise&lt;void&gt; | void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>onError</td>
    <td>提交表单数据验证失败后的回调事件</td>
    <td>
      <code>(error)=>void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>onReset</td>
    <td>点击重置按钮的回调，此时数据已重置完成</td>
    <td>
      <code>()=>void</code>
    </td>
    <td>-</td>
  </tr>
</table>

##### ProForm Methods
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 200px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>getFormRef</td>
    <td>获取组件内 el-form 的 ref</td>
    <td>
      <code>()=>Ref</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>getForm</td>
    <td>获取表单数据</td>
    <td>
      <code>(values)=>Promise&lt;void&gt; | void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>setFieldsValue</td>
    <td>手动更新表单数据</td>
    <td>
      <code>(values)=>void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>setFieldValue</td>
    <td>手动更新单个字段数据</td>
    <td>
      <code>(key,value)=>void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>submit</td>
    <td>手动提交表单</td>
    <td>
      <code>()=>void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>手动重置表单</td>
    <td>
      <code>()=>void</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>resetAllFields</td>
    <td>重置表单的拓展方法，过滤了非表单项的字段</td>
    <td>
      <code>()=>void</code>
    </td>
    <td>-</td>
  </tr>
</table>

##### formItemsConfig
在 [el-form-item attributes](https://element.eleme.io/2.15/#/zh-CN/component/form#form-item-attributes) 基础上，新增了以下 API。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 160px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>valueType</td>
    <td>表单组件类型，会生成不同的渲染器。设置 <code>slot</code> 表示自定义</td>
    <td>
      <a href="../../schema/api.md#valuetype" target="_blank">valueType</a> | <code>slot</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>fieldProps</td>
    <td>表单组件的 attributes。如果渲染出来的是 <code>el-input</code>，则对应 <code>el-input</code> 的 attributes</td>
    <td>
      <code>object</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>fieldEvents</td>
    <td>表单组件的 events。如果渲染出来的是 <code>el-input</code>，则对应 <code>el-input</code> 的 events</td>
    <td>
      <code>object</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>options</td>
    <td>选择器、单选框组、多选框组 的数据</td>
    <td>
      <code>Array</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>valueEnum</td>
    <td>选择器枚举，方便自动生成选项</td>
    <td>
      <a href="../../schema/api.md#valueenum" target="_blank">valueEnum</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>optionLoader</td>
    <td>异步生成 选择器、级联选择器 下拉数据</td>
    <td>
      <code>()=>Promise&lt;any&gt;</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>initialValue</td>
    <td>表单项默认值，优先级高于 <code>initialValues</code></td>
    <td>
      <code>any</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>colProps</td>
    <td>开启 <code>grid</code> 模式时传递给 <code>el-col</code></td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/layout#col-attributes" target="_blank">ColProps</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>hideInForm</td>
    <td>在表单中不展示此项</td>
    <td>
      <code>boolean</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>slot</td>
    <td>自定义 <code>el-form-item</code></td>
    <td>
      <code>boolean</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>renderLabel</td>
    <td>自定义 <code>el-form-item</code> 的 <code>label</code></td>
    <td>
      <code>()=>jsx</code>
    </td>
    <td>-</td>
  </tr>
</table>

> options 参数的格式为选择器[选项](https://element.eleme.io/2.15/#/zh-CN/component/select#ji-chu-yong-fa)，同时，兼容了选择器的分组，可以传递分组的[选项](https://element.eleme.io/2.15/#/zh-CN/component/select#fen-zu)，判断依据是列表中第一条数据包含了 options 数组。

##### valueType slot
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td><code>[prop]</code></td>
    <td>自定义表单元素，参数为 { form, formItem }</td>
  </tr>
</table>

##### el-form-item slot
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td><code>[prop]</code></td>
    <td>自定义 el-form-item，参数为 { form }</td>
  </tr>
</table>

##### submitterProps
submitter 设置 `false` 会隐藏默认的提交按钮。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 160px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>submitText</td>
    <td>提交按钮的文本</td>
    <td><code>string</code></td>
    <td>提交</td>
  </tr>
  <tr>
    <td>resetText</td>
    <td>重置按钮的文本</td>
    <td><code>string</code></td>
    <td>重置</td>
  </tr>
  <tr>
    <td>submitButtonProps</td>
    <td>提交按钮的 attributes & button 的原生属性</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/button#attributes" target="_blank">ButtonProps</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>resetButtonProps</td>
    <td>重置按钮的 attributes & button 的原生属性</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/button#attributes" target="_blank">ButtonProps</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>render</td>
    <td>自定义渲染</td>
    <td>
      <code>false | (form,action,doms)=>jsx</code>
    </td>
    <td>-</td>
  </tr>
</table>

> render 的第一个参数是表单数据；第二个参数是事件对象；第三个参数是默认的 doms 数组，第一个是重置按钮，第二个是提交按钮。
