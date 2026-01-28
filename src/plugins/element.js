import Vue from 'vue'
import {
  // loading
  Loading,

  // 基础组件
  Button,
  Icon,
  Row,
  Col,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Input,
  InputNumber,
  Switch,
  Select,
  Option,
  OptionGroup,
  Cascader,
  CascaderPanel,
  
  // 时间日期组件
  TimeSelect,
  TimePicker,
  DatePicker,
  
  // 上传评分组件
  Upload,
  Rate,
  
  // 表单组件
  Form,
  FormItem,
  
  // 数据组件
  Table,
  TableColumn,
  Pagination,
  
  // 反馈组件
  Tooltip,
  Popover,

  // 弹框组件
  Dialog,
} from 'element-ui'

// 注册指令
Vue.use(Loading.directive);

// 注册组件
Vue.use(Button)
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Cascader)
Vue.use(CascaderPanel);
Vue.use(TimeSelect);
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Rate)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Dialog)
