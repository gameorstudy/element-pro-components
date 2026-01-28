<template>
  <el-dialog
    :visible.sync="dialogVisible"
    v-bind="initializedDialogProps"
    v-on="initializedDialogEvents"
  >
    <!-- 自定义 dialog title -->
    <!-- start -->
    <template #title>
      <slot name="title" />
    </template>
    <!-- end -->
    <el-form
      ref="dialogFormRef"
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
    </el-form>
    <!-- submitter -->
    <!-- start -->
    <template v-if="submitter" #footer>
      <!-- 自定义 submitter -->
      <!-- start -->
      <template v-if="submitter.render">
        <render-action 
          :submitter="submitterProps" 
          :action="{ submit, cancel, reset, resetAllFields }"
          :render="(action, doms) => submitter.render(form, action, doms)" 
        />
      </template>
      <!-- end -->
      <!-- 默认 submitter -->
      <!-- start -->
      <template v-else>
        <span class="dialog-form-footer">
          <el-button v-bind="submitterProps.cancelButtonProps" @click="cancel" >{{ submitterProps.cancelText }}</el-button>
          <el-button type="primary" v-bind="submitterProps.submitButtonProps" @click="submit">{{ submitterProps.submitText }}</el-button>
        </span>
      </template>
      <!-- end -->
    </template>
    <!-- end -->
  </el-dialog>
</template>

<script>
  import ProFormItem from '@/components/ProFormItem'
  import RenderAction from './components/RenderAction.vue';
  import { setPlaceholder, setSelectOptions, setCascaderOptions } from '@/utils/form'

  export default {
    name: 'DialogForm',
    model: {
      prop: 'visible',
      event: 'close'
    },
    components: {
      ProFormItem,
      RenderAction
    },
    props: {
      // 是否打开弹框
      visible: {
        type: Boolean,
        default: false
      },
      // 弹框的标题
      title: {
        type: String
      },
      // 自定义标题
      renderTitle: {
        type: Function
      },
      // 弹框的宽度
      width: {
        type: String
      },
      // el-dialog attributes 的配置
      dialogProps: {
        type: Object,
        default: () => ({})
      },
      // el-dialog events 的配置
      dialogEvents: {
        type: Object,
        default: () => ({})
      },
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
      // 初始化 dialog props
      initializedDialogProps() {
        const { dialogProps = {}, title, width } = this
        const customClass = dialogProps['custom-class']
        return {
          ...dialogProps,
          'custom-class': customClass ? `${customClass} dialog-form` : 'dialog-form',
          visible: undefined, // 使用 v-model
          title,
          width,
        }
      },
      // 初始化 dialog events
      initializedDialogEvents() {
        const { dialogEvents } = this
        
        // 包装以下 close 方法，确保执行 cancel 方法
        const originalClose = dialogEvents.close
        if (originalClose) {
          dialogEvents.close = () => {
            originalClose()
            this.cancel()
          }
        }
        return {
          ...dialogEvents
        }
      },
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
            cancelText: '取消'
          }

          // 对象类型
          if (typeof this.submitter === 'object') {
            const { submitText, cancelText, submitButtonProps = {}, cancelButtonProps = {} } = this.submitter
          
            return {
              ...defaultTextConfig,
              submitText,
              cancelText,
              submitButtonProps,
              cancelButtonProps
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
        dialogVisible: false, // 是否打开弹框
        cachedOptions: {}, // 下拉数据 { [prop]: data }
        form: this.initForm(), // 表单数据
      }
    },
    watch: {
      // 监听 visible
      visible: {
        handler(newValue) {
          this.dialogVisible = newValue
        },
        immediate: true
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
        return this.$refs.dialogFormRef
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
       * @desc 关闭
       */
      cancel() {
        this.$emit('close', false)
      },
      /**
       * @desc 提交
       */
      submit() {
        this.$refs.dialogFormRef?.validate((valid, object) => {
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
          await this.$refs.dialogFormRef?.resetFields()
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
        this.$refs.dialogFormRef?.clearValidate()
        // 重置数据
        this.form = this.initForm()
      },
    }
  }
</script>

<style>
.dialog-form .el-dialog__body {
  padding-bottom: 8px;
}

.dialog-form .el-dialog__footer {
  padding-top: 0;
}
</style>
