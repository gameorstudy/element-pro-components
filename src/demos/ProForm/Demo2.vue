<template>
  <div class="demo-wrapper">
    <el-row>
      <el-col :md="24" :lg="6">
        <h4>验证点</h4>
        <ul>
          <li>ProForm.grid</li>
          <li>ProForm.rowProps</li>
          <li>ProFormMethods.submit</li>
          <li>ProFormMethods.reset</li>
          <li>ProFormMethods.resetAllFields</li>
          <li>submitter = false</li>
          <li>submitter.submitText</li>
          <li>submitter.resetText</li>
          <li>submitter.submitButtonProps</li>
          <li>submitter.resetButtonProps</li>
          <li>submitter.render</li>
        </ul>
      </el-col>
      <el-col :md="24" :lg="18" style="padding: 0 10px;">
        <ProForm 
          ref="proFormRef"
          className="pro-form-demo"
          :formProps="formProps"
          :formItems="formItems"
          :grid="true"
          :rowProps="{
            gutter: 20
          }"
          :submitter="submitter"
          @onFinish="onFinish"
          @onError="onError"
          @onReset="onReset"
        />
        <div style="margin-top: 20px">
          <el-button @click="submit">手动提交表单</el-button>
          <el-button @click="reset">手动重置表单</el-button>
          <el-button @click="setFieldsValue">添加非表单项字段</el-button>
          <el-button @click="resetAllFields">重置表单的拓展方法</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ProForm from '@/components/ProForm'

  export default {
    name: 'ProFormDemo2',
    components: {
      ProForm,
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
      submitter() {
        return {
          submitText: '确定',
          resetText: '重置（二次确认）',
          submitButtonProps: {
            loading: this.loading
          },
          resetButtonProps: {
            type: 'danger'
          },
          render: (_, __, doms) => {
            return [
              doms[0],
              <el-button>自定义按钮</el-button>,
              doms[1]
            ]
          }
        }
      }
    },
    data() {
      return {
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
        loading: false,
      }
    },
    methods: {
      onFinish(values) {
        console.log('values', values)
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      },
      onError(err) {
        console.log('err', err)
      },
      onReset() {
        const form = this.$refs.proFormRef.getForm()
        console.log('reset 后的 form', form)
      },
      setFieldsValue() {
        this.$refs.proFormRef.setFieldsValue({
          hello: 'world'
        })
        const form = this.$refs.proFormRef.getForm()
        console.log('添加了非表单项的 form', form)
      },
      resetAllFields() {
        this.$refs.proFormRef.resetAllFields()
        const form = this.$refs.proFormRef.getForm()
        console.log('过滤了非表单项的 form', form)
      },
      submit() {
        this.$refs.proFormRef.submit()
      },
      reset() {
        this.$refs.proFormRef.reset()
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
</style>

<style>
.cascader-popper .el-cascader-menu__wrap {
  height: 204px;
}
</style>
