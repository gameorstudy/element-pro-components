<script>
  export default {
    name: 'CustomRender',
    props: {
      render: {
        type: Function,
        required: true
      }
    },
    render: function(h) {
      return <Fragment>
        {this.render()}
      </Fragment>
    }
  }
</script>

<style scoped>

</style>
