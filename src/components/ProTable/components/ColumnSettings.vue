<template>
   <el-popover
    popper-class="column-setting-popover"
    placement="bottom-end"
    trigger="click"
  >
    <div class="toolbar-item" slot="reference">
      <el-tooltip :content="columnSettings.settingText" placement="top">
        <SettingIcon />
      </el-tooltip>
    </div>
    <div class="popover-title">
      <div class="column-setting-title">
        <el-checkbox
          v-if="columnSettings.checkable"
          :value="checkedAll"
          :indeterminate="isIndeterminate"
          @change="handleChange"
          >{{ columnSettings.settingText }}</el-checkbox
        >
        <span v-else>{{ columnSettings.settingText }}</span>
        <el-button type="text" @click="handleReset">{{
          columnSettings.resetText
        }}</el-button>
      </div>
    </div>
    <div class="popover-content">
      <div class="column-setting-list-group">
        <!-- 固定在列首 -->
        <!-- start -->
        <ColumnSettingsItem
          :columnSettings="columnSettings"
          :columns="leftFixedColumns"
        />
        <!-- end -->
        <!-- 不固定 -->
        <!-- start -->
        <ColumnSettingsItem
          :columnSettings="columnSettings"
          :columns="noFixedColumns"
        />
        <!-- end -->
        <!-- 固定在列尾 -->
        <!-- start -->
        <ColumnSettingsItem
          :columnSettings="columnSettings"
          :columns="rightFixedColumns"
        />
        <!-- end -->
      </div>
    </div>
  </el-popover>
</template>

<script>
import SettingIcon from "./svg/SettingIcon.vue";
import ColumnSettingsItem from "./ColumnSettingsItem.vue";

export default {
  name: "ColumnSettings",
  inject: ["onColumnSettingsChange"],
  components: {
    SettingIcon,
    ColumnSettingsItem,
  },
  props: {
    // 列设置
    columnSettings: {
      type: Object
    },
    // 列项
    columns: {
      type: Array,
      required: true,
    },
    // 规则
    rules: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // 初始化 columns
    initialedColumns() {
      const { columns, rules } = this;

      return rules
        .map((rule) => {
          const index = columns.findIndex(
            (item) => (item.prop || item.key) === rule.prop
          );
          if (index !== -1) {
            const { label, disabled } = columns[index];
            return { ...rule, label, disabled };
          }

          return;
        })
        .filter(Boolean);
    },
    // 固定在左侧列
    leftFixedColumns() {
      return this.initialedColumns.filter((item) => item.fixed === "left");
    },
    // 不固定列
    noFixedColumns() {
      return this.initialedColumns.filter(
        (item) => item.fixed !== "left" && item.fixed !== "right"
      );
    },
    // 固定在右侧列
    rightFixedColumns() {
      return this.initialedColumns.filter((item) => item.fixed === "right");
    },
    // 列展示勾选状态
    checkedAll() {
      return (
        this.initialedColumns.length ===
        this.initialedColumns.filter((item) => item.checked).length
      );
    },
    // 表示 checkbox 的不确定状态
    isIndeterminate() {
      return (
        !this.checkedAll &&
        this.initialedColumns.filter((item) => !item.disabled && item.checked)
          .length > 0
      );
    },
  },
  data() {
    return {};
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
      this.onColumnSettingsChange({ event: "reset" });
    },
  },
};
</script>

<style scoped>
.toolbar-item {
  display: flex;
  margin-block: 0;
  margin-inline: 4px;
  color: rgba(42, 46, 54, 0.88);
  font-size: 16px;
  cursor: pointer;
}

.toolbar-item:hover {
  color: #409eff;
}

.toolbar-item svg {
  outline: none;
}

.column-setting-popover .popover-title .column-setting-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}

.column-setting-popover .popover-content {
  width: 200px;
  padding-block: 0;
  padding-inline: 0;
  padding-block-end: 8px;
}
</style>
