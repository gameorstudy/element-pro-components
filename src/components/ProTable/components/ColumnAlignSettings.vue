<template>
  <span class="icon-group">
    <template v-if="column.fixed !== 'left'">
      <el-tooltip content="固定在列首" placement="top">
        <span
          class="icon icon-vertical-align"
          @click.stop="handleAlgin(column, 'left')"
        >
          <VerticalAlignTopIcon />
        </span>
      </el-tooltip>
    </template>
    <template v-if="column.fixed === 'left' || column.fixed === 'right'">
      <el-tooltip content="不固定" placement="top">
        <span
          class="icon icon-vertical-align"
          @click.stop="handleAlgin(column)"
        >
          <VerticalAlginMiddleIcon />
        </span>
      </el-tooltip>
    </template>
    <template v-if="column.fixed !== 'right'">
      <el-tooltip content="固定在列尾" placement="top">
        <span
          class="icon icon-vertical-align"
          @click.stop="handleAlgin(column, 'right')"
        >
          <VerticalAlginBottomIcon />
        </span>
      </el-tooltip>
    </template>
  </span>
</template>

<script>
import VerticalAlignTopIcon from "./svg/VerticalAlignTopIcon.vue";
import VerticalAlginBottomIcon from "./svg/VerticalAlginBottomIcon.vue";
import VerticalAlginMiddleIcon from "./svg/VerticalAlginMiddleIcon.vue";

export default {
  name: "ColumnAlginSettings",
  inject: ["onColumnSettingsChange"],
  components: {
    VerticalAlignTopIcon,
    VerticalAlginMiddleIcon,
    VerticalAlginBottomIcon,
  },
  props: {
    // 列数据
    column: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    /**
     * @desc 监听修改
     * @param {Object} column 列项
     */
    handleAlgin(column, fixed) {
      const { prop } = column;
      // ProTable provide 提供
      this.onColumnSettingsChange({ event: "align", prop, fixed });
    },
  },
};
</script>

<style scoped>
</style>