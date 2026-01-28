<template>
  <div class="demo1">
    <h4>验证点（只列举非 ProForm 的点）</h4>
    <ul>
      <li>DialogForm.v-model</li>
      <li>DialogForm.title</li>
      <li>DialogForm.width</li>
      <li>DialogForm.dialogProps</li>
      <li>DialogForm.dialogEvents</li>
    </ul>
    <el-button type="primary" @click="visible = true">打开弹框</el-button>
    <DialogForm 
      v-model="visible"
      title="标题"
      width="980px"
      :dialogProps="{
        'close-on-click-modal': false
      }"
      :dialogEvents="{
        close: this.close
      }"
      className="dialog-form-demo"
      :formProps="formProps"
      :formItems="formItems"
      :grid="true"
      @onFinish="onFinish"
    />
  </div>
</template>

<script>
  import DialogForm from '@/components/DialogForm'

  export default {
    name: 'DialogFormDemo1',
    components: {
      DialogForm,
    },
    computed: {
      formItems() {
        return [
          {
            label: '活动名称',
            prop: 'name',
            valueType: 'input',
            rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
            colProps: {
              span: 8
            }
          },
          {
            label: '活动地点一',
            prop: 'place',
            valueType: 'input',
            rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
            colProps: {
              span: 8
            }
          },
          {
            label: '活动地点二',
            prop: 'place2',
            valueType: 'input',
            rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
            colProps: {
              span: 8
            }
          },
          {
            label: '活动区域1',
            prop: 'region',
            valueType: 'select',
            options: [
              { label: '区域一', value: '1' },
              { label: '区域二', value: '2' }
            ],
          },
          {
            label: '活动类型',
            prop: 'type',
            valueType: 'cascader',
            fieldProps: {
              options: this.cascaderOptions,
              'popper-class': 'cascader-popper'
            }
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
            initialValue: '这是一条默认信息',
            colProps: {
              span: 12
            }
          },
        ]
      },
    },
    data() {
      return {
        visible: false,
        formProps: {
          'label-position': 'top'
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
        ],
      }
    },
    methods: {
      close() {
        console.log('关闭')
      },
      onFinish(values) {
        console.log('values', values)
      },
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
</style>
