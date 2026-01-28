<template>
  <!-- 默认 el-form-item -->
  <!-- start -->
  <el-form-item
    v-bind="{
      ...initializedFormItem,
      prop: formItemProp || initializedFormItem.prop
    }"
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
        v-on="formItem.fieldEvents"
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
    name: 'ProFormItem',
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
      // 可编辑表格 el-form-item prop
      formItemProp: {
        type: String
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
    },
    data() {
      return {
        groups: ['radio-group', 'checkbox-group'], // valueType
        selection: { // 选项组对应的组件
          'radio-group': 'el-radio',
          'checkbox-group': 'el-checkbox'
        }
      }
    }
  }
</script>

<style scoped>

</style>
