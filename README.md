#### element-pro-components
本项目是受 Antd Pro Components 的启发，见[官方地址](https://procomponents.ant.design/components)

#### Render Functions & JSX
> 项目默认使用 render functions & jsx，以便代码结构统一，方便维护。

首先让我们先揭开它们的面纱，也可以跳过直接查看[官方文档](https://v2.vuejs.org/v2/guide/render-function)。
假设我们要定义一个叫 `anchored-heading` 的组件，基于模板我们可能会给出这样的答案
```
<template>
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</template>
```
如果使用了 render 函数，我们可以给出下面的答案
```
render: function (createElement) {
  return createElement(
    'h' + this.level,   // tag name
    this.$slots.default // array of children
  )
}
```
在这种情况下，我会投 render 函数一票。
现在我们知道了定义组件不只有 `template` 这一种方法。现在我们基于上面定义的 `anchored-heading` 组件进行一个 render 函数的应用
```
render: function (createElement) {
  createElement(
    'anchored-heading', {
      props: {
        level: 1
      }
    }, [
      createElement('span', 'Hello'),
      ' world!'
    ]
  )
}
```
这个时候你可能会开始怀念模板语法了，那有没有可能让我们在享受 render 函数的便捷也能使用模板语法呢，答案是有的，你可能也猜到了，那就是我们的 `jsx`，下面是 jsx 版本的 render 函数。
```
render: function (h) {
  return (
    <AnchoredHeading level={1}>
      <span>Hello</span> world!
    </AnchoredHeading>
  )
}
```
JSX，全称是 JavaScript XML，是 JavaScript 语法扩展，可以让你在 JavaScript 文件中书写类似 HTML 的标签。不过与 `vue` 的 `template` 有些许不同，不过不用担心，需要的时候可以随时查阅[文档](https://zh-hans.react.dev/learn/passing-props-to-a-component)。

脚手架项目默认是不开启 jsx 支持的，可以按照如下步骤开启：
1. 安装 `@vue/cli-plugin-babel` 插件
```
npm install -D @vue/cli-plugin-babel
```
2. babel.config.js 文件添加配置
```
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"]
}
```
#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```
