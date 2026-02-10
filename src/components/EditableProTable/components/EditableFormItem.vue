<template>
  <!-- 默认 el-form-item -->
  <!-- start -->
  <el-form-item
    v-bind="initializedFormItem"
    :key="formItem.prop"
  >
    <template v-if="formItem.renderLabel" #label>
      <!-- 自定义 label -->
      <!-- start -->
      <custom-render :render="formItem.renderLabel" />
      <!-- end -->
    </template>
    <template v-if="formItem.valueType !== 'slot'">
      <component
        :is="`el-${formItem.valueType}`"
        v-model="form[formItem.prop]"
        v-bind="formItem.fieldProps"
        v-on="initializedFieldEvents"
      >
        <!-- Select -->
        <!-- start -->
        <template v-if="formItem.valueType === 'select'">
          <!-- Option Group -->
          <!-- start -->
          <template v-if="isGroupedOptions">
            <el-option-group
              v-for="group in formItem.options"
              v-bind="group"
              :key="group.label"
            >
              <el-option 
                v-for="option in group.options"
                v-bind="option"
                :key="option.value"
              ></el-option>
            </el-option-group>
          </template>
          <!-- end -->
          <!-- Option -->
          <!-- start -->
          <template v-else>
            <el-option 
              v-for="option in formItem.options"
              v-bind="option"
              :key="option.value"
            ></el-option>
          </template>
          <!-- end -->
        </template>
        <!-- end -->
        <template v-else-if="groups.includes(formItem.valueType)">
          <component
            :is="selection[formItem.valueType]"
            v-for="option in formItem.options"
            :label="option.value"
            :key="option.value"
          >
          {{ option.label }}
        </component>
        </template>
      </component>
    </template>
    <template v-else>
      <slot :name="formItem.prop" :form="form" :formItem="formItem"></slot>
    </template>
  </el-form-item>
  <!-- end -->
</template>

<script>
  import CustomRender from '@/components/CustomRender'
  
  export default {
    name: 'EditableFormItem',
    components: {
      CustomRender,
    },
    props: {
      // formItem 项
      formItem: {
        type: Object,
        required: true 
      },
      // 表单数据
      form: {
        type: Object,
        required: true
      },
      // 是否是可编辑表格
      editable: {
        type: Boolean,
        default: false
      },
      // 可编辑表格名称
      name: {
        type: String,
      },
      scope: {
        type: Object
      },
      rowKey: {
        type: [Number, String]
      },
      index: {
        type: Number
      },
      recordKey: {
        type: [Number, String]
      },
      formRef: {
        type: Object
      }
    },
    computed: {
      // 过滤非 el-form-item 的属性
      initializedFormItem() {
        const {
          valueType,
          fieldProps, 
          fieldEvents, 
          options,
          valueEnum, 
          optionLoader, 
          initialValue, 
          colProps,
          renderLabel,
          ...keys
        } = this.formItem

        // 兼容可编辑表格
        if (this.editable) {
          const { name, scope, formItem } = this
          keys.prop = `${name}.${scope.$index}.${formItem.prop}`
        }

        return keys
      },
      // 判断是否是分组选择
      isGroupedOptions() {
        const { formItem: { options } } = this
        if (!options?.length) {
          return false
        }

        // 检查第一个元素是否包含 options 数组
        const opts = options[0].options
        return opts && Array.isArray(opts)
      },
      // 表单事件
      initializedFieldEvents() {
        const { formItem: { fieldEvents = {} }, editable, scope, rowKey } = this

        if (!fieldEvents) {
          return undefined
        }

        if (!editable) {
          return fieldEvents
        }

        const newEvents = {}

        // 兼容可编辑表格
        for (const eventName in fieldEvents) {
          const handler = (...args) => fieldEvents[eventName]?.(...args, {
            recordKey: scope.row[rowKey],
            index: scope.$index,
            row: scope.row
          })

          newEvents[eventName] = handler
        }

        return newEvents
      }
    },
    data() {
      return {
        groups: ['radio-group', 'checkbox-group'], // valueType
        selection: { // 选项组对应的组件
          'radio-group': 'el-radio',
          'checkbox-group': 'el-checkbox'
        },
      }
    },
  }
</script>

<style scoped>
</style>
