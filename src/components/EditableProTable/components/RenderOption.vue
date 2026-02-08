<script>
  export default {
    name: 'RenderOption',
    props: {
      render: {
        type: Function,
        required: true
      },
      editable: {
        type: Object,
        required: true
      },
      isEditable: {
        type: Boolean,
      },
      recordCreatorProps: {
        type: Object,
        required: true
      },
      isNewLineRecordCache: {
        type: Boolean
      },
      row: {
        type: Object,
      },
      rowKey: {
        type: [String, Number]
      },
      action: {
        type: Object
      },
      dataSource: {
        type: Array
      }
    },
    data() {
      return {
        visible: false,
        loading: false
      }
    },
    methods: {
      /**
       * @desc 开始编辑指定字段
       * @param {String | Number} recordKey 值
       * @returns {Boolean}
       */
      startEditable(recordKey) {
        const { validateCanStartEdit } = this.action
        if (!validateCanStartEdit()) {
          return false
        }

        const { editable: { editableKeys, onChange } } = this

        const isAlreadyEditable = editableKeys?.some(key => key === recordKey)

        if (!isAlreadyEditable) {
          // 保存开始编辑的数据
          const row = this.dataSource.find(item => item[this.rowKey] === recordKey)
          this.preEditRow = row
          onChange?.([...editableKeys, recordKey])
        }

        return true
      },
      /**
       * @desc 取消编辑
       * @param {String | Number} recordKey 值
       */
      cancelEditable(recordKey) {
        const { editable: { editableKeys, onChange } } = this
        if (!editableKeys.includes(recordKey)) {
          return
        }

        const newKeys = editableKeys.filter(item => item !== recordKey)
        onChange?.(newKeys)
      },
      async save() {
        try {
          this.loading = true
          const recordKey = this.row[this.rowKey]
          const res = await this.editable.onSave(recordKey, this.row, this.preEditRow, null)
          this.loading = false
          if (res === false) {
            return
          }

          this.cancelEditable(recordKey)
          if (this.isNewLineRecordCache) {
            this.$emit('save', recordKey)
          }
        } catch (err) {
          console.error('err', err)
          this.loading = false
        }
      },
      async cancel() {
        const recordKey = this.row[this.rowKey]
        await this.editable?.onCancel?.(recordKey, this.row, this.preEditRow, null)
        this.cancelEditable(recordKey)
        if (this.isNewLineRecordCache) {
          this.$emit('cancel', recordKey)
        }
      },
      async delete() {
        const recordKey = this.row[this.rowKey]
        const res = await this.editable?.onDelete?.(recordKey, this.row, this.preEditRow, null)
        if (res === false) {
          return
        }
        this.visible = false
        this.cancelEditable(recordKey)
        this.$emit('delete', recordKey)
      }
    },
    render: function(h) {
      const { saveText, deleteText, cancelText, deletePopconfirmMessage } = this.editable
      
      const doms = {
        save: <el-button type="text" class="btn-save" loading={this.loading} onClick={this.save}>{ saveText }</el-button>,
        cancel: <el-button type="text" class="btn-cancel" onClick={this.cancel}>{ cancelText }</el-button>,
        delete: <el-popover placement="top" popper-class="delete-popover-message" trigger="click" value={this.visible} onInput={val => this.visible = val}>
          <p>
            <i class="el-icon-warning" style="color: #ffad00; margin-right: 8px" />
            <span>{ deletePopconfirmMessage }</span>
          </p>
          <div style="text-align: right; margin-left: 22px">
            <el-button size="mini" type="text" onClick={() => { this.visible = false }}>取消</el-button>
            <el-button type="primary" size="mini" onClick={this.delete}>确定</el-button>
          </div>
          <el-button slot="reference" type="text">{ deleteText }</el-button>
        </el-popover>
      }

      const { startEditable, cancelEditable } = this

      const action = { startEditable, cancelEditable }

      return <Fragment>
        {!this.isEditable ? this.render(action) : [doms.save, !this.isNewLineRecordCache && doms.delete, doms.cancel].filter(Boolean)}
      </Fragment>
    }
  }
</script>

<style scoped>
.btn-save + span {
  margin-left: 10px;
}

span + .btn-cancel {
  margin-left: 10px;
}
</style>

<style>
.delete-popover-message.el-popover {
  min-width: unset;
}
</style>
