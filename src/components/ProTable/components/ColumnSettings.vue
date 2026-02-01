<template>
  <el-popover
    popper-class="column-settings-popover"
    placement="bottom-end"
    trigger="click"
  >
    <div class="pro-table__toolbar-item" slot="reference">
      <el-tooltip :content="columnSettings.settingText" placement="top">
        <SettingIcon />
      </el-tooltip>
    </div>
    <div class="column-settings-popover-header">
      <el-checkbox
        v-if="columnSettings.checkable"
        :value="checkAll" 
        :indeterminate="isIndeterminate"
        @change="handleChange"
      >
        {{ columnSettings.settingText }}
      </el-checkbox>
      <span v-else>{{ columnSettings.settingText }}</span>
      <el-button type="text" @click="handleReset">{{ columnSettings.resetText }}</el-button>
    </div>
    <div class="column-settings-popover-content">
      <!-- 固定在列首 -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="leftFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
      <!-- 不固定 -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="noFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
      <!-- 固定在列尾 -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="rightFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
    </div>
  </el-popover>
</template>

<script>
import SettingIcon from './svg/SettingIcon.vue'
import ColumnSettingsItem from './ColumnSettingsItem.vue'

export default {
  name: 'ColumnSettings',
  components: {
    SettingIcon,
    ColumnSettingsItem
  },
  inject: ["onColumnSettingsChange"],
  props: {
    // 列表项
    columns: {
      type: Array,
      required: true,
    },
    // 列设置
    columnSettings: {
      type: Object,
    },
  },
  computed: {
    // 固定在左侧列
    leftFixedColumns() {
      return this.columns.filter((item) => item.fixed === "left")
    },
    // 不固定列
    noFixedColumns() {
      return this.columns.filter(
        (item) => item.fixed !== "left" && item.fixed !== "right"
      )
    },
    // 固定在右侧列
    rightFixedColumns() {
      return this.columns.filter((item) => item.fixed === "right")
    },
    // 列展示勾选状态
    checkAll() {
      return this.columns.length === this.columns.filter(item => item.checkable).length
    },
    // 表示 checkbox 的不确定状态
    isIndeterminate() {
      return !this.checkAll && this.columns.filter(item => !item.disabled && item.checkable).length > 0
    },
  },
  data() {
    return {
    }
  },
  methods: {
    /**
     * @desc 监听修改
     * @param {Boolean} checked 状态
     */
    handleChange(checked) {
      // ProTable provide 提供
      this.onColumnSettingsChange({ event: "checkAll", checked });
    },
    /**
     * @desc 重置
     */
    handleReset() {
      // ProTable provide 提供
      this.onColumnSettingsChange({ event: "reset" })
    },
  }
}
</script>

<style scoped>
.pro-table__toolbar-item {
  display: flex;
  margin-block: 0;
  margin-inline: 4px;
  color: rgba(42, 46, 54, 0.88);
  font-size: 16px;
  cursor: pointer;
}

.pro-table__toolbar-item svg {
  outline: none;
}

.pro-table__toolbar-item:hover {
  color: #409eff;
}

.column-settings-popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}

.column-settings-popover-content {
  width: 200px;
  padding-block: 0;
  padding-inline: 0;
  padding-block-end: 8px;
}
</style>