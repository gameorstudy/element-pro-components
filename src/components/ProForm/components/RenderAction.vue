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
        submitter: { submitText, resetText, submitButtonProps, resetButtonProps },
        action: { reset, submit },
      } = this
      // 非原生元素需要放到 props 里，测试是 vue jsx 解析的原因
      const submitProps = { props: submitButtonProps, submitButtonProps }
      const resetProps = { props: resetButtonProps, resetButtonProps }
      const doms = [
        <el-button { ...resetProps } onClick={reset} key='reset'>{ resetText }</el-button>,
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
