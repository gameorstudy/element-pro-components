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
      }
      // action: {
      //   type: Object,
      //   required: true
      // },
    },
    data() {
      return {
        visible: false
      }
    },
    render: function(h) {
      const { recordCreatorProps: { newRecordType } } = this
      const { saveText, deleteText, cancelText, deletePopconfirmMessage } = this.editable
      
      const doms = {
        save: <el-button type="text">{ saveText }</el-button>,
        cancel: <el-button type="text">{ cancelText }</el-button>,
        delete: <el-popover placement="top" popper-class="delete-popover-message" trigger="click" value={this.visible} onInput={val => this.visible = val }>
          <p>
            <i class="el-icon-warning" style="color: #ffad00; margin-right: 8px" />
            <span>{ deletePopconfirmMessage }</span>
          </p>
          <div style="text-align: right; margin-left: 22px">
            <el-button size="mini" type="text" onClick={() => { this.visible = false }}>取消</el-button>
            <el-button type="primary" size="mini" onClick={() => { this.visible = false }}>确定</el-button>
          </div>
          <el-button class="btn-delete" slot="reference" type="text">{ deleteText }</el-button>
        </el-popover>
      }

      const showDelete = newRecordType === 'dataSource'

      return <Fragment>
        {!this.isEditable ? this.render() : [doms.save, doms.cancel && showDelete, doms.delete].filter(Boolean)}
      </Fragment>
    }
  }
</script>

<style scoped>
.btn-delete {
  margin: 0 10px;
}
</style>

<style>
.delete-popover-message.el-popover {
  min-width: unset;
}

.delete-popover-message p {
  margin: 0 0 8px;
}
</style>
