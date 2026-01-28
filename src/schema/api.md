##### valueType
valueType 是 ProComponents 的灵魂，ProComponents 会根据 valueType 来映射成不同的表单项。以下是支持的常见表单项：
| valueType | 说明 |
| ----------- | ----------- |
| `input` | `el-input` |
| `select` | `el-select` |
| `cascader` | `el-cascader` |
| `radio-group` | `el-radio-group` |
| `checkbox-group` | `el-checkbox-group` |
| `input-number` | `el-input-number` |
| `switch` | `el-switch` |
| `time-select` | `el-time-select` |
| `time-picker` | `el-time-picker` |
| `date-picker` | `el-date-picker` |
| `upload` | `el-upload` |
| `rate` | `el-rate` |

##### valueEnum
valueEnum 是最基础的用法，它支持传入一个 `Object` 或者是 `Map`，相比于 `options` 格式更加的简单。
```
{
  all: '全部',
  open: '未解决',
  closed: '已解决'
}
```
会自动生成
```
[
  { label: '全部', value: 'all' },
  { label: '未解决', value: 'open' },
  { label: '已解决', value: 'closed' }
]
```
