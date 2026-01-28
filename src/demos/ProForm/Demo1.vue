<template>
  <div class="demo-wrapper">
    <el-row>
      <el-col :md="24" :lg="8">
        <h4>验证点</h4>
        <ul>
          <li>ProForm.formProps</li>
          <li>ProForm.className</li>
          <li>ProForm.formItems</li>
          <li>ProForm.initialValues</li>
          <li>ProFormEvents.onFinish</li>
          <li>ProFormEvents.onError</li>
          <li>ProFormEvents.onReset</li>
          <li>ProFormMethods.getFormRef</li>
          <li>ProFormMethods.getForm</li>
          <li>ProFormMethods.setFieldsValue</li>
          <li>ProFormMethods.setFieldValue</li>
          <li>FormItems.valueType</li>
          <li>FormItems.valueType = slot</li>
          <li>FormItems.fieldProps</li>
          <li>FormItems.fieldEvents</li>
          <li>FormItems.options 下拉选择</li>
          <li>FormItems.options 多选框组</li>
          <li>FormItems.options 单选框组</li>
          <li>FormItems.options 下拉分组选择</li>
          <li>FormItems.valueEnum object 下拉选择（可能无序）</li>
          <li>FormItems.valueEnum map 下拉选择（有序）</li>
          <li>FormItems.optionLoader 下拉选择</li>
          <li>FormItems.fieldProps.options 级联选择</li>
          <li>FormItems.optionLoader 级联选择</li>
          <li>FormItems.initialValue</li>
          <li>FormItems.hideInForm</li>
          <li>FormItems.slot</li>
          <li>FormItems.renderLabel</li>
        </ul>
      </el-col>
      <el-col :md="24" :lg="16">
        <ProForm 
          ref="proFormRef"
          className="pro-form-demo"
          :formProps="formProps"
          :formItems="formItems"
          :initialValues="{
            date1: new Date(2026, 0, 1),
            date2: Date.now()
          }"
          @onFinish="onFinish"
          @onError="onError"
          @onReset="onReset"
        >
          <!-- 自定义表单元素 -->
          <!-- start -->
          <template #hello="{ form }">
            <el-input v-model="form.hello" key="hello"></el-input>
          </template>
          <!-- end -->
          <!-- 活动时间 -->
          <!-- start -->
          <template #datetime="{ form }">
            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </template>
          <!-- end -->
        </ProForm>
        <el-button @click="getFormRef">获取formRef</el-button>
        <el-button @click="getForm">获取form</el-button>
        <el-button @click="setFieldsValue">更新表单数据</el-button>
        <el-button @click="setFieldValue">更新单个字段数据</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ProForm from '@/components/ProForm'

  export default {
    name: 'ProFormDemo1',
    components: {
      ProForm,
    },
    computed: {
      formItems() {
        return [
          {
            label: '自定义表单元素',
            prop: 'hello',
            valueType: 'slot'
          },
          {
            prop: 'world',
            valueType: 'input',
            renderLabel: () => (
              <span style="color: red">自定义标签</span>
            )
          },
          {
            label: '活动名称',
            prop: 'name',
            valueType: 'input',
            rules: [{ required: true, message: '请输入', trigger: ['blur'] }]
          },
          {
            label: '活动区域1',
            prop: 'region',
            valueType: 'select',
            options: [
              { label: '区域一', value: '1' },
              { label: '区域二', value: '2' }
            ],
            fieldProps: {
              clearable: true
            },
            fieldEvents: {
              change: (val) => {
                console.log('change', val)
              }
            }
          },
          {
            label: '活动区域2',
            prop: 'region2',
            valueType: 'select',
            options: [
              { 
                label: '分组一', 
                options: [
                  { label: '区域一', value: '1' },
                  { label: '区域二', value: '2' }
                ] 
              },
              { 
                label: '分组二', 
                options: [
                  { label: '区域三', value: '3' },
                ] 
              },
            ]
          },
          {
            label: '活动区域3',
            prop: 'region3',
            valueType: 'select',
            valueEnum: { // 可能无序
              'beijing': '北京',
              'shanghai': '上海',
              'guangzhou': '广州'
            }
          },
          {
            label: '活动区域4',
            prop: 'region4',
            valueType: 'select',
            valueEnum: new Map([ // 有序
              ['beijing', '北京'],
              ['shanghai', '上海'],
              ['guangzhou', '广州']
            ])
          },
          {
            label: '活动区域5',
            prop: 'region5',
            valueType: 'select',
            optionLoader: () => {
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve([
                    { label: '区域一', value: '1' },
                    { label: '区域二', value: '2' }
                  ])
                }, 2000)
              })
            }
          },
          {
            label: '活动类型1',
            prop: 'type1',
            valueType: 'cascader',
            fieldProps: {
              options: this.cascaderOptions,
              'popper-class': 'cascader-popper'
            }
          },
          {
            label: '活动类型2',
            prop: 'type2',
            valueType: 'cascader',
            optionLoader: () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(this.cascaderOptions)
                }, 2000)
              })
            },
            fieldProps: {
              'popper-class': 'cascader-popper'
            }
          },
          {
            prop: 'datetime',
            slot: true,
          },
          {
            label: '活动性质',
            prop: 'category',
            valueType: 'checkbox-group',
            options: [
              { label: '美食/餐厅线上活动', value: '美食/餐厅线上活动' },
              { label: '地推活动', value: '地推活动' },
              { label: '线下主题活动', value: '线下主题活动' },
              { label: '单纯品牌曝光', value: '单纯品牌曝光' },
            ],
            initialValue: [],
          },
          {
            label: '特殊资源',
            prop: 'resource',
            valueType: 'radio-group',
            options: [
              { label: '线上品牌商赞助', value: '线上品牌商赞助' },
              { label: '线下场地免费', value: '线下场地免费' }
            ]
          },
          {
            label: '活动形式',
            prop: 'desc',
            valueType: 'input',
            fieldProps: {
              type: 'textarea',
            },
            initialValue: '这是一条默认信息'
          },
          {
            label: '我被隐藏了',
            valueType: 'input',
            prop: 'hide',
            hideInForm: true
          }
        ]
      }
    },
    data() {
      return {
        formProps: {
          'label-width': '110px'
        },
        cascaderOptions: [
          {
            value: '1',
            label: '类型一',
            children: [
              {
                value: 'ball',
                label: '球类',
                children: [
                  {
                    value: 'basketball',
                    label: '篮球'
                  }, 
                  {
                    value: 'football',
                    label: '足球'
                  }, 
                  {
                    value: 'badminton',
                    label: '羽毛球'
                  }
                ]
              }, 
            ]
          },
          {
            value: '2',
            label: '类型二',
            children: [
              {
                value: 'ball',
                label: '跑步',
                children: [
                  {
                    value: 'race',
                    label: '短跑'
                  }, 
                  {
                    value: 'marathon',
                    label: '长跑'
                  },
                ]
              }, 
            ]
          }
        ]
      }
    },
    methods: {
      getFormRef() {
        const formRef = this.$refs.proFormRef.getFormRef()
        console.log('formRef', formRef)
      },
      getForm() {
        const form = this.$refs.proFormRef.getForm()
        console.log('form', form)
      },
      setFieldsValue() {
        this.$refs.proFormRef.setFieldsValue({
          name: '活动名称一'
        })
      },
      setFieldValue() {
        this.$refs.proFormRef.setFieldValue('name', '活动名称二')
      },
      onFinish(values) {
        console.log('values', values)
      },
      onError(err) {
        console.log('err', err)
      },
      onReset() {
        const form = this.$refs.proFormRef.getForm()
        console.log('reset 后的 form', form)
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

.pro-form-demo .line {
  text-align: center;
}
</style>

<style>
.cascader-popper .el-cascader-menu__wrap {
  height: 204px;
}
</style>
