#### ProForm - 高级表单
ProForm 是通过配置动态生成 el-form 组件，减少模板语法，使表单开发更简单。
以下是几个设计思路：
1. ProForm 非受控，可以通过事件监听获取实时数据；
2. ProForm 自定义表单元素频繁，基于 `v-model` 语法支持考虑自定义渲染使用 `slot`；
3. `el-form-item` 自定义标签和按钮操作使用 `jsx`，目的是使代码结构更加清晰。
##### API
ProForm 在 el-form 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 el-form 不同的 API。
##### ProForm Attributes
| 参数 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| formProps | el-form attributes 的配置 | [FormProps](https://element.eleme.io/2.15/#/zh-CN/component/form#form-attributes) | - |
| className | 组件内 el-form 的类名 | `string` | - |
| formItems | 表单项配置 | `formItemsConfig` | - |
| submitter | 提交按钮相关配置 | `boolean \| submitterProps` | `true` |
| grid | 开启栅格化模式，宽度默认百分比 | `boolean` | - |
| rowProps | 开启 `grid` 模式时传递给 `el-row` | [RowProps](https://element.eleme.io/2.15/#/zh-CN/component/layout#row-attributes) | { gutter: 8 } |
| initialValues | 表单默认值 | `object` | - |
##### ProForm Events
| 参数 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| onFinish | 提交表单且数据验证成功后回调事件 | `(values)=>Promise<void> \｜ void` | - |
| onError | 提交表单数据验证失败后的回调事件 | `(error)=>void` | - |
| onReset | 点击重置按钮的回调，此时数据已重置完成 | `()=>void` | - |
##### ProForm Methods
| 参数 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| getFormRef | 获取组件内 el-form 的 ref | `()=>Ref` | - |
| getForm | 获取表单数据 | `(values)=>Promise<void> \｜ void` | - |
| setFieldsValue | 手动更新表单数据 | `(values)=>void` | - |
| setFieldValue | 手动更新单个字段数据 | `(key,value)=>void` | - |
| submit | 手动提交表单 | `()=>void` | - |
| reset | 手动重置表单 | `()=>void` | - |
| resetAllFields | 重置表单的拓展方法，过滤了非表单项 的字段 | `()=>void` | - |
##### formItemsConfig
支持 [el-form-item attributes](https://element.eleme.io/2.15/#/zh-CN/component/form#form-item-attributes) 的配置，下面的是新增的 API。
| 参数 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| valueType | 表单组件类型，会生成不同的渲染器。设置 `slot` 表示自定义 | [valueType](../../schema/api.md) \| `slot` | - |
| fieldProps | 表单组件的 attributes。如果渲染出来的是 `el-input`，则对应 `el-input` 的 attributes | `object` | - |
| fieldEvents | 表单组件的 events。会透传给表单项，如果渲染出来的是 `el-input`，则对应 `el-input` 的 events | `object` | - |
| options | 选择器、单选框组、多选框组 的数据 | `Array` | - |
| valueEnum | 选择器枚举，方便自动生成选项 | [valueEnum](../../schema/api.md) | - |
| optionLoader | 异步生成 选择器、级联选择器 下拉数据 | `()=>Promise<any>` | - |
| initialValue | 表单项默认值，优先级高于 `initialValues` | `any` | - |
| colProps | 开启 `grid` 模式时传递给 `el-col` | [ColProps](https://element.eleme.io/2.15/#/zh-CN/component/layout#col-attributes) | - |
| hideInForm | 在表单中不展示此项 | `boolean` | - |
| slot | 自定义 `el-form-item` | `boolean` | - |
| renderLabel | 自定义 `el-form-item` 的 `label` | `()=>jsx` | - |

> options 参数的格式为选择器[选项](https://element.eleme.io/2.15/#/zh-CN/component/select#ji-chu-yong-fa)，同时，兼容了选择器的分组，可以传递分组的[选项](https://element.eleme.io/2.15/#/zh-CN/component/select#fen-zu)，判断依据是列表中第一条数据包含了 options 数组。

##### valueType slot
| name | 描述 |
| ----------- | ----------- |
| `[prop]` | 自定义表单元素，参数为 { form, formItem } |
##### el-form-item slot
| name | 描述 |
| ----------- | ----------- |
| `[prop]` | 自定义 el-form-item，参数为 { form } |
##### submitterProps
submitter 设置 `false` 会隐藏默认的提交按钮。
| 参数 | 说明 | 类型 | 默认值 |
| ----------- | ----------- | ----------- | ----------- |
| submitText | 提交按钮的文本 | `string` | 提交 |
| resetText | 重置按钮的文本 | `string` | 重置 |
| submitButtonProps | 提交按钮的 attributes & button 的原生属性 | [ButtonProps](https://element.eleme.io/2.15/#/zh-CN/component/button#attributes) | - |
| resetButtonProps | 重置按钮的 attributes & button 的原生属性 | [ButtonProps](https://element.eleme.io/2.15/#/zh-CN/component/button#attributes) | - |
| render | 自定义渲染 | `false` \| `(form, action, dom)=>jsx` | - |
> render 的第一个参数是表单数据；第二个参数是事件对象；第三个参数是默认的 dom 数组，第一个是重置按钮，第二个是提交按钮。
