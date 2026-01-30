<template>
  <div v-if="columns.length" class="column-setting-list">
    <div class="column-setting-list-title">{{ title }}</div>
    <div ref="dragDropZoneRef" class="drag-drop-zone">
      <div
        class="site-tree-list"
        v-for="(column, index) in columns"
        :class="{
          'site-tree-list-draggable': draggable,
          dragging: draggingIndex === index,
        }"
        :draggable="draggable"
        :key="column.prop"
        @dragstart="(e) => onDragstart(e, index)"
        @dragenter.prevent="onDragenter"
        @dragover.prevent="(e) => onDragover(e, index)"
        @dragleave="onDragleave"
        @drop="(e) => onDrop(e, index)"
        @dragend="onDragend"
      >
        <span v-if="draggable" class="site-tree-draggable-icon">
          <span class="icon icon-holder">
            <HolderIcon />
          </span>
        </span>
        <span class="site-tree-switcher"></span>
        <template v-if="columnSettings.checkable">
          <el-checkbox
            :value="column.checked"
            @change="(checked) => handleChange(checked, column.prop)"
            :disabled="column.disabled"
          >
            <span class="tree-node-content-wrapper">{{ column.label }}</span>
            <ColumnAlignSettings :column="column" />
            <!-- 第一个元素头部插入 -->
            <!-- start -->
            <div
              v-if="index === 0 && showHeadIndicator"
              class="site-tree-top-head-indicator"
            ></div>
            <!-- end -->
            <!-- 尾部插入 -->
            <!-- start -->
            <div
              v-else-if="droppedIndex === index"
              class="site-tree-drop-indicator"
            ></div>
            <!-- end -->
          </el-checkbox>
        </template>
        <template v-else>
          <span class="tree-node-algin-wrapper">
            <span class="tree-node-content-wrapper">{{ column.label }}</span>
            <ColumnAlignSettings :column="column" />
            <!-- 第一个元素头部插入 -->
            <!-- start -->
            <div
              v-if="index === 0 && showHeadIndicator"
              class="site-tree-top-head-indicator"
            ></div>
            <!-- end -->
            <!-- 尾部插入 -->
            <!-- start -->
            <div
              v-else-if="droppedIndex === index"
              class="site-tree-drop-indicator"
            ></div>
            <!-- end -->
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HolderIcon from "./svg/HolderIcon.vue";
import ColumnAlignSettings from "./ColumnAlignSettings.vue";

export default {
  name: "ColumnSettingsItem",
  inject: ["onColumnSettingsChange"],
  components: {
    HolderIcon,
    ColumnAlignSettings,
  },
  props: {
    // 列数据
    columns: {
      type: Array,
      default: () => [],
    },
    // 列设置
    columnSettings: {
      type: Object,
    },
  },
  computed: {
    // 列类型
    title() {
      const { columns } = this;
      if (Array.isArray(columns) && columns.length) {
        const fixed = columns[0].fixed;
        return fixed === "left"
          ? "固定在左侧"
          : fixed === "right"
          ? "固定在右侧"
          : "不固定";
      }

      return "";
    },
    // 数组长度 > 1 可拖动
    draggable() {
      return this.columnSettings.draggable && this.columns?.length > 1;
    },
  },
  data() {
    return {
      draggingIndex: -1, // 开始拖动目标的下标
      droppedIndex: -1, // 可释放目标的下标
      showHeadIndicator: false, // 是否在头节点插入
    };
  },
  methods: {
    /**
     * @desc 监听修改
     * @param {Boolean} checked 状态
     * @param {String} prop 属性
     */
    handleChange(checked, prop) {
      // ProTable provide 提供
      this.onColumnSettingsChange({ event: "check", checked, prop });
    },
    /**
     * @desc 获取光标位置
     * @param {Object} e
     * @returns {String} top | bottom
     */
    getCursorPos(e) {
      // 1. 获取元素的位置和尺寸
      const rect = e.target.getBoundingClientRect();

      // 2. 获取鼠标相对于元素的位置
      const relativeY = e.clientY - rect.top;

      // 3. 判断光标在释放目标位置的上半还是下半
      const cursorPos = relativeY < rect.height / 2 ? "top" : "bottom";

      return cursorPos      
    },
    /**
     * @desc 活动释放目标位置
     * @param {String} cursorPos top | bottom
     * @param {String} dragDirection up | down
     * @param {Number} droppedIndex 释放目标的下标
     */
    getDropPos(cursorPos, dragDirection, droppedIndex) {
      if (cursorPos === 'top') {
        if (dragDirection === 'down' && this.draggingIndex === droppedIndex - 1) {
          // 考虑到向下拖动的上一个位置可能是开始拖动的元素
          return -1
        } else {
          return droppedIndex - 1
        }
      } else {
        if (dragDirection === 'up' && this.draggingIndex === droppedIndex + 1) {
          // 考虑到向上拖动的下一个位置可能是开始拖动的元素
          return -1
        } else {
          return droppedIndex
        }
      }
    },
    /**
     * @desc 开始拖动
     * @param {Object} e 拖拽元素对象
     * @param {Number} index 下标
     */
    onDragstart(e, index) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      this.draggingIndex = index;
    },
    /**
     * @desc 拖入到释放目标
     * @param {Object} e 拖拽元素对象
     */
    onDragenter(e) {
      if (this.draggingIndex === -1) {
        // 其它拖拽区域
        e.dataTransfer.dropEffect = 'none'
      } else {
        e.dataTransfer.dropEffect = 'move'
      }
    },
    /**
     * @desc 拖拽到释放目标上
     * @param {Object} e 释放目标对象
     * @param {Number} droppedIndex 下标
     */
    onDragover(e, droppedIndex) {
      // ***参数是在事件绑定时确定的 而不是在事件触发时***

      // 如果拖动到其它列 
      if (this.draggingIndex === -1) {
        e.dataTransfer.dropEffect = 'none'
        return
      }

      // 释放目标是开始拖动目标 则退出
      if (this.draggingIndex === droppedIndex) {
        this.droppedIndex = -1
        return;
      }

      // 获取光标位置
      const cursorPos = this.getCursorPos(e)
      
      // 光标在释放目标位置上半 则在释放目标位置上方插入
      // 光标在释放目标位置下半 则在释放目标位置下方插入
      if (cursorPos === 'top' && droppedIndex === 0) {
        // 这里有点特殊 因为向上拖动且释放元素是下标为 0 时 需要在最上方显示插入标志
        this.showHeadIndicator = true
        this.droppedIndex = -1
        return
      }

      // 取消插入到第一个元素的样式
      this.showHeadIndicator = false

      // 当前拖拽的方向
      const dragDirection = this.draggingIndex < droppedIndex ? "down" : "up";
      // 获取释放的位置
      this.droppedIndex = this.getDropPos(cursorPos, dragDirection, droppedIndex)
    },
    /**
     * @desc 离开可释放目标
     */
    onDragleave(e) {
      const dragDropZoneRef = this.$refs.dragDropZoneRef
      // 是否在列表区域内
      if (dragDropZoneRef.contains(e.relatedTarget)) {
        return
      }

      this.droppedIndex = -1
      this.showHeadIndicator = false
    },
    /**
     * @desc 释放目标停止拖拽
     * @param {Object} e 释放目标对象
     * @param {Number} droppedIndex 释放的下标
     */
    onDrop(e, droppedIndex) {
      if (this.draggingIndex === droppedIndex) {
        this.droppedIndex = -1
        return;
      }

      // 获取光标位置
      const cursorPos = this.getCursorPos(e)
      if (cursorPos === 'top' && droppedIndex === 0) {
        // 插入到第一个节点上面
        const fromProp = this.columns[this.draggingIndex].prop
        // ProTable provide 提供
        this.onColumnSettingsChange({ event: 'drop', fromProp });
        return
      }

      // 当前拖拽的方向
      const dragDirection = this.draggingIndex < droppedIndex ? "down" : "up";
      // 实际释放的位置
      const actualDroppedIndex = this.getDropPos(cursorPos, dragDirection, droppedIndex)
      // 开始拖动元素插入实际释放的位置下面 && 二者不能相同
      if (actualDroppedIndex !== -1) {
        const fromProp = this.columns[this.draggingIndex].prop
        const toProp = this.columns[this.droppedIndex].prop
        // ProTable provide 提供
        this.onColumnSettingsChange({ event: 'drop', fromProp, toProp })
      }
    },
    /**
     * @desc 结束拖动
     */
    onDragend() {
      // 重置
      this.draggingIndex = -1
      this.droppedIndex = -1
      this.showHeadIndicator = false
    }
  },
};
</script>

<style>
.column-setting-popover .column-setting-list-title {
  margin-block-start: 6px;
  margin-block-end: 6px;
  padding-inline-start: 24px;
  color: rgba(42, 46, 54, 0.65);
  font-size: 12px;
}

.column-setting-popover .site-tree-list {
  display: flex;
  align-items: center;
  padding: 0 0 4px 0;
  outline: none;
  color: rgba(42, 46, 54, 0.88);
}

.column-setting-popover .site-tree-list-draggable {
  cursor: grab;
}

.column-setting-popover .dragging {
  position: relative;
}

.column-setting-popover .dragging::after {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  bottom: 4px;
  inset-inline-start: 0;
  border: 1px solid #1677ff;
  opacity: 0;
  animation-name: show;
  animation-duration: 0.3s;
  animation-play-state: running;
  animation-fill-mode: forwards;
  content: "";
  pointer-events: none;
}

.column-setting-popover .dragging .el-checkbox__label,
.column-setting-popover .dragging .tree-node-algin-wrapper {
  background: #e3f0ff;
}

.column-setting-popover .site-tree-draggable-icon {
  flex-shrink: 0;
  width: 24px;
  line-height: 24px;
  text-align: center;
  visibility: visible;
  opacity: 0.2;
  transition: opacity 0.3s;
}

.column-setting-popover .icon-holder {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.column-setting-popover .site-tree-switcher {
  position: relative;
  flex: none;
  align-self: stretch;
  width: 24px;
  margin: 0;
  line-height: 24px;
  text-align: center;
  cursor: unset;
  user-select: none;
  transition: all 0.3s;
  border-radius: 6px;
}

.column-setting-popover .site-tree-list .tree-node-algin-wrapper {
  width: 100%;
  display: inline-block;
}

.column-setting-popover .site-tree-list .el-checkbox {
  flex: 1;
}

.column-setting-popover .site-tree-list .el-checkbox__label {
  width: calc(100% - 18px);
}

.column-setting-popover .site-tree-list .el-checkbox__label,
.column-setting-popover .site-tree-list .tree-node-algin-wrapper {
  line-height: 24px;
  padding-left: 0;
  margin-left: 4px;
  padding: 0 4px;
  border-radius: 6px;
  box-sizing: border-box;
  transition: background-color 0.2s;
  position: relative;
}

.column-setting-popover .site-tree-list .el-checkbox__label:hover,
.column-setting-popover .site-tree-list .tree-node-algin-wrapper:hover {
  background-color: rgba(42, 46, 54, 0.04);
}

.column-setting-popover .site-tree-list .icon-group {
  float: right;
  height: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.column-setting-popover .site-tree-list .icon-vertical-align {
  font-size: 14px;
  color: #1677ff;
  cursor: pointer;
  display: none;
  transition: display 0.2s;
}

.column-setting-popover .site-tree-list:hover .icon-vertical-align {
  display: inline-flex;
}

.column-setting-popover .site-tree-list:hover .icon-vertical-align svg {
  outline: none;
}

.column-setting-popover .tree-node-content-wrapper {
  display: inline-flex;
  max-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}

.column-setting-popover .site-tree-drop-indicator,
.column-setting-popover .site-tree-top-head-indicator {
  width: calc(100% - 4px);
  height: 2px;
  background-color: #1677ff;
  border-radius: 1px;
  pointer-events: none;
  position: absolute;
  z-index: 1;
  bottom: -3px;
}

.column-setting-popover .site-tree-top-head-indicator {
  top: 0;
}

.column-setting-popover .site-tree-top-head-indicator::before,
.column-setting-popover .site-tree-drop-indicator::after {
  position: absolute;
  left: 0;
  top: -3px;
  inset-inline-start: -6px;
  width: 8px;
  height: 8px;
  background-color: transparent;
  border: 2px solid #1677ff;
  border-radius: 50%;
  content: "";
  box-sizing: border-box;
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
