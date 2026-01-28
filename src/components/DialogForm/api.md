#### DialogForm - 弹框表单
DialogForm 是 ProForm 的一个变体，本质上仍然是个表单。DialogForm 的表现与 ProForm 相同，可以从 ProForm 直接修改而来。
以下是几个设计思路：
1. DialogForm 非受控，可以通过事件监听获取实时数据；
2. 不支持通过 footer 来自定义页脚，如果要定义页脚需要使用 submitter.render；
3. `dialog` 提交按钮使用 `jsx`，目的是使代码结构更加清晰。
##### API
DialogForm 在 el-dialog 和 el-form 上进行了一层封装，支持了一些预设。
##### DialogForm Attributes
在 <a href="../ProForm/api.md#proform-attributes">ProForm Attributes</a> 基础上，新增了以下 API。
<table style="display: table">
  <tr>
    <th style="width: 100px">参数</th>
    <th>说明</th>
    <th style="width: 180px">类型</th>
    <th style="width: 80px">默认值</th>
  </tr>
  <tr>
    <td>v-model</td>
    <td>是否打开弹框</td>
    <td><code>boolean</code></td>
    <td>-</td>
  </tr>
  <tr>
    <td>title</td>
    <td>弹框的标题</td>
    <td>
      <code>string</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>width</td>
    <td>弹框的宽度</td>
    <td>
      <code>string</code>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>dialogProps</td>
    <td>el-dialog attributes 的配置。注意：不支持 <code>visible</code>，请使用 <code>v-model</code></td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/dialog#attributes" target="_blank">DialogProps</a>
    </td>
    <td>-</td>
  </tr>
  <tr>
    <td>dialogEvents</td>
    <td>el-dialog events 的配置</td>
    <td>
      <a href="https://element.eleme.io/2.15/#/zh-CN/component/dialog#events" target="_blank">DialogEvents</a>
    </td>
    <td>-</td>
  </tr>
</table>

##### DialogForm Events
同 <a href="../ProForm/api.md#proform-events" target="_blank">ProForm Events
</a>

##### DialogForm Methods
同 <a href="../ProForm/api.md#proform-methods" target="_blank">ProForm Methods</a>

##### DialogForm title slot
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td><code>title</code></td>
    <td>自定义 el-dialog 标题</td>
  </tr>
</table>

##### formItemsConfig
同 <a href="../ProForm/api.md#formitemsconfig" target="_blank">formItemsConfig</a>

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
    <td>cancelText</td>
    <td>取消按钮的文本</td>
    <td><code>string</code></td>
    <td>取消</td>
  </tr>
  <tr>
    <td>submitButtonProps</td>
    <td>提交按钮的 attributes & button 的原生属性</td>
    <td><a href="https://element.eleme.io/2.15/#/zh-CN/component/button#attributes" target="_blank">ButtonProps</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>cancelButtonProps</td>
    <td>取消按钮的 attributes & button 的原生属性</td>
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

> render 的第一个参数是表单数据；第二个参数是事件对象；第三个参数是默认的 doms 数组，第一个是取消按钮，第二个是提交按钮。
