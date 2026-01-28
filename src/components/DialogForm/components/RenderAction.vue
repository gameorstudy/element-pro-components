<script>
  export default {
    name: 'RenderAction',
    props: {
      render: {
        type: Function,
        required: true
      },
      submitter: {
        type: Object,
        required: true
      },
      action: {
        type: Object,
        required: true
      }
    },
    render: function(h) {
      const { 
        submitter: { submitText, cancelText, submitButtonProps, cancelButtonProps },
        action: { cancel, submit },
      } = this
      // 非原生属性需要放到 props 里，测试是 vue 解析 jsx 的原因
      const submitProps = { props: submitButtonProps, submitButtonProps }
      const cancelProps = { props: cancelButtonProps, cancelButtonProps }
      const doms = [
        <el-button { ...cancelProps } onClick={cancel} key='cancel'>{ cancelText }</el-button>,
        <el-button type="primary" { ...submitProps } onClick={submit} key='submit'>{ submitText }</el-button>
      ]

      return <Fragment>
        {this.render(this.action, doms)}
      </Fragment>
    }
  }
</script>

<style scoped>

</style>
