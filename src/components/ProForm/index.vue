<template>
  <el-form
    ref="proFormRef"
    class="pro-form"
    :model="form"
    :class="className"
    v-bind="formProps"  
  >
    <!-- 栅格化布局 -->
    <!-- start -->
    <template v-if="grid">
      <el-row v-bind="rowProps">
        <el-col v-for="item in normalizedFormItems" v-bind="item.colProps" :key="item.prop">
          <!-- 默认 el-form-item -->
          <!-- start -->
          <template v-if="!item.slot">
            <ProFormItem :form="form" :formItem="item">
              <template #[item.prop]="scope">
                  <slot :name="item.prop" v-bind="scope" />
                </template>
            </ProFormItem>
          </template>
          <!-- end -->
          <!-- 自定义 el-form-item -->
          <!-- start -->
          <slot v-else :name="item.prop" :form="form"></slot>
          <!-- end -->
        </el-col>
      </el-row>
    </template>
    <!-- end -->
    <!-- 非栅格化布局 -->
    <!-- start -->
    <template v-else>
      <template v-for="item in normalizedFormItems">
        <!-- 默认 el-form-item -->
        <!-- start -->
        <template v-if="!item.slot">
          <ProFormItem :form="form" :formItem="item">
            <template #[item.prop]="scope">
              <slot :name="item.prop" v-bind="scope" />
            </template>
          </ProFormItem>
        </template>
        <!-- end -->
        <!-- 自定义 el-form-item -->
        <!-- start -->
        <slot v-else :name="item.prop" :form="form"></slot>
        <!-- end -->
      </template>
    </template>
    <!-- end -->
    <!-- submitter -->
    <!-- start -->
    <template v-if="submitter">
      <!-- 自定义 submitter -->
      <!-- start -->
      <template v-if="submitter.render">
        <render-action 
          :submitter="submitterProps" 
          :action="{ submit, reset, resetAllFields }"
          :render="(action, doms) => submitter.render(form, action, doms)" 
        />
      </template>
      <!-- end -->
      <!-- 默认 submitter -->
      <!-- start -->
      <template v-else>
        <el-form-item>
          <el-button v-bind="submitterProps.resetButtonProps" @click="reset" >{{ submitterProps.resetText }}</el-button>
          <el-button type="primary" v-bind="submitterProps.submitButtonProps" @click="submit">{{ submitterProps.submitText }}</el-button>
        </el-form-item>
      </template>
      <!-- end -->
    </template>
    <!-- end -->
  </el-form>
</template>

<script>
  import ProFormItem from '@/components/ProFormItem'
  import RenderAction from './components/RenderAction.vue';
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'

  export default {
    name: 'ProForm',
    components: {
      ProFormItem,
      RenderAction
    },
    props: {
      // el-form attributes 的配置
      formProps: {
        type: Object,
        default: () => ({})
      },
      // el-form 的类名
      className: {
        type: String
      },
      // 表单项配置
      formItems: {
        type: Array,
        required: true,
        default: () => []
      },
      // 提交按钮相关配置
      submitter: {
        type: [Boolean, Object],
        default: true
      },
      // 开启栅格化模式
      grid: {
        type: Boolean,
      },
      // 开启 grid 模式时传递给 el-row
      rowProps: {
        type: Object,
        default: () => ({ gutter: 8 })
      },
      // 表单默认值
      initialValues: {
        type: Object,
        default: () => { }
      },
    },
    computed: {
      // formItems 标准化处理
      normalizedFormItems() {
        return this.formItems
          // 过滤隐藏项
          .filter(item => !item.hideInForm)
          .map(item => {
            const { valueType, fieldProps = {} } = item
            // 设置 placeholder
            setPlaceholder(fieldProps, valueType)

            // 设置 select options
            setSelectOptions(item, this.cachedOptions)

            // 设置 cascader options
            setCascaderOptions(fieldProps, item, this.cachedOptions)

            return {
              ...item,
              fieldProps
            }
          })
      },
      // submitter 标准化处理
      submitterProps() {
        if (this.submitter) {
          // 配置按钮文本
          const defaultTextConfig = {
            submitText: '提交',
            resetText: '重置'
          }

          // 对象类型
          if (typeof this.submitter === 'object') {
            const { submitText, resetText, submitButtonProps = {}, resetButtonProps = {} } = this.submitter
          
            return {
              ...defaultTextConfig,
              submitText,
              resetText,
              submitButtonProps,
              resetButtonProps
            }
          }

          // 返回默认配置
          return {
            ...defaultTextConfig
          }
        }

        return false
      }
    },
    data() {
      return {
        cachedOptions: {}, // 下拉数据 { [prop]: data }
        form: this.initForm(), // 表单数据
      }
    },
    created () {
      // 获取异步数据
      this.getOptions()
    },
    methods: {
      /**
       * @desc 获取异步下拉数据
       */
      getOptions() {
        for (const item of this.formItems) {
          const { prop, optionLoader } = item
          if (typeof optionLoader === 'function') {
            optionLoader().then(res => {
              this.cachedOptions = {
                ...this.cachedOptions,
                [prop]: res
              }
            })
          }
        }
      },
      /**
       * @desc 初始化表单数据
       */
      initForm() {
        const { formItems, initialValues } = this
        // 兼容
        if (!formItems?.length) {
          return {}
        }

        const data = formItems.reduce((accu, cur) => {
          const { prop, initialValue } = cur

          return {
            ...accu,
            [prop]: initialValue
          }
        }, {})

        return { ...initialValues, ...data }
      }, 
      /**
       * @desc 获取 el-form ref
       * @returns {Object}
       */
      getFormRef() {
        return this.$refs.proFormRef
      },
      /**
       * @desc 获取表单数据
       * @returns {Object}
       */
      getForm() {
        return this.form
      },
      /**
       * @desc 手动更新表单数据
       * @param {Object} data 数据
       */
      setFieldsValue(data) {
        this.form = {
          ...this.form,
          ...data
        }
      },
      /**
       * @desc 手动更新单个字段数据
       * @param {String} key 键
       * @param {any} value 值
       */
      setFieldValue(key, value) {
        this.form[key] = value
      },
      /**
       * @desc 提交
       */
      submit() {
        this.$refs.proFormRef?.validate((valid, object) => {
          if (valid) {
            // 回传给父组件
            this.$emit('onFinish', this.form)
            return
          }

          // 回传给父组件
          this.$emit('onError', object)
        })
      },
      /**
       * @desc 重置
       */
      async reset() {
        try {
          await this.$refs.proFormRef?.resetFields()
          // 回传给父组件
          this.$emit('onReset')
        } catch (err) {
          console.error('err', err)
        }
      },
      /**
       * @desc 重置表单的拓展方法，过滤了非表单项的字段
       */
      resetAllFields() {
        // 清除校验
        this.$refs.proFormRef?.clearValidate()
        // 重置数据
        this.form = this.initForm()
      },
    } 
  }
</script>

<style scoped>

</style>
