# vue3-simple-drag-resize

[![npm version](https://img.shields.io/npm/v/vue3-simple-drag-resize.svg)](https://www.npmjs.com/package/vue3-simple-drag-resize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)

一个轻量级的 Vue 3 组件，支持拖拽、缩放和碰撞检测功能。

[English](./README.md) | 简体中文

**GitHub 仓库**: [https://github.com/sunmaolin/vue3-simple-drag-resize](https://github.com/sunmaolin/vue3-simple-drag-resize)

## 特性

- 🎯 **拖拽功能** - 支持鼠标和触摸事件的流畅拖拽
- 📐 **缩放功能** - 8 个方向的缩放手柄（四角和四边）
- 💥 **碰撞检测** - 防止组件重叠
- 🔒 **限制在父容器内** - 将移动限制在父容器范围内
- 📏 **尺寸约束** - 设置最小和最大宽度/高度
- 🎨 **轴向限制** - 限制拖拽为水平或垂直方向
- 📱 **触摸支持** - 在移动设备上正常工作
- 🌐 **TypeScript** - 完整的 TypeScript 支持和类型定义
- 🎭 **灵活的 API** - 丰富的属性和事件用于自定义

## 安装

```bash
npm install vue3-simple-drag-resize
```

```bash
yarn add vue3-simple-drag-resize
```

```bash
pnpm add vue3-simple-drag-resize
```

## 快速开始

### 全局注册

```typescript
import { createApp } from 'vue'
import { createDragResize } from 'vue3-simple-drag-resize'

const app = createApp(App)
app.use(createDragResize(), { isCollision: true })
app.mount('#app')
```

### 局部注册

```vue
<script setup lang="ts">
import { DragResize } from 'vue3-simple-drag-resize'
</script>

<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="100" :y="100" :w="200" :h="200">
      <div>拖拽我！</div>
    </DragResize>
  </div>
</template>
```

## 属性

| 属性          | 类型                   | 默认值                                             | 描述                         |
| ------------- | ---------------------- | -------------------------------------------------- | ---------------------------- |
| `x`           | `number`               | `0`                                                | 初始左侧位置（相对于父元素） |
| `y`           | `number`               | `0`                                                | 初始顶部位置（相对于父元素） |
| `w`           | `number`               | `200`                                              | 组件宽度                     |
| `h`           | `number`               | `200`                                              | 组件高度                     |
| `z`           | `number \| 'auto'`     | `'auto'`                                           | 组件的 z-index               |
| `isLimit`     | `boolean`              | `false`                                            | 限制在父容器内移动           |
| `maxW`        | `number`               | -                                                  | 最大宽度                     |
| `maxH`        | `number`               | -                                                  | 最大高度                     |
| `minW`        | `number`               | `50`                                               | 最小宽度                     |
| `minH`        | `number`               | `50`                                               | 最小高度                     |
| `sticks`      | `Stick[]`              | `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']` | 缩放手柄数组                 |
| `stickSize`   | `number`               | `8`                                                | 缩放手柄大小（像素）         |
| `isResizable` | `boolean`              | `true`                                             | 启用/禁用缩放                |
| `isDraggable` | `boolean`              | `true`                                             | 启用/禁用拖拽                |
| `axis`        | `'x' \| 'y' \| 'both'` | `'both'`                                           | 限制拖拽方向                 |

### 手柄类型

| 手柄 | 位置     |
| ---- | -------- |
| `tl` | 左上角   |
| `tm` | 上边中点 |
| `tr` | 右上角   |
| `mr` | 右边中点 |
| `br` | 右下角   |
| `bm` | 下边中点 |
| `bl` | 左下角   |
| `ml` | 左边中点 |

## 事件

| 事件          | 参数   | 描述               |
| ------------- | ------ | ------------------ |
| `clicked`     | -      | 组件被点击时触发   |
| `dragging`    | `Rect` | 拖拽过程中触发     |
| `dragstop`    | `Rect` | 拖拽结束时触发     |
| `resizing`    | `Rect` | 缩放过程中触发     |
| `resizestop`  | `Rect` | 缩放结束时触发     |
| `activated`   | -      | 组件激活时触发     |
| `deactivated` | -      | 组件失活时触发     |
| `collision`   | `Collision` | 组件发生碰撞时触发 |

### Rect 类型

```typescript
interface Rect {
  left: number
  top: number
  width: number
  height: number
}
```

### Collision 类型

```typescript
interface Collision {
  boundary: 'left' | 'right' | 'top' | 'bottom'
  overlap: number
}
```

- `boundary`: 碰撞发生的边界方向
- `overlap`: 碰撞重叠量（像素）

## 碰撞检测

启用碰撞检测以防止组件重叠：

```typescript
app.use(createDragResize(), { isCollision: true })
```

启用后，组件将在拖拽和缩放操作期间自动防止重叠。碰撞检测使用视口坐标来正确处理具有不同父元素的组件。

## 使用示例

### 基础用法

```vue
<template>
  <div class="container">
    <DragResize :x="50" :y="50" :w="150" :h="150">
      <div class="content">基础组件</div>
    </DragResize>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}

.content {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}
</style>
```

### 限制在父容器内

```vue
<template>
  <DragResize :x="10" :y="10" :w="100" :h="100" :is-limit="true">
    <div>限制在父容器内</div>
  </DragResize>
</template>
```

### 最小/最大尺寸约束

```vue
<template>
  <DragResize :x="50" :y="50" :w="150" :h="150" :min-w="100" :min-h="100" :max-w="300" :max-h="300">
    <div>尺寸约束</div>
  </DragResize>
</template>
```

### 单轴拖拽

```vue
<template>
  <DragResize :x="50" :y="50" axis="x">
    <div>只能水平拖拽</div>
  </DragResize>
</template>
```

### 自定义缩放手柄

```vue
<template>
  <DragResize :sticks="['tl', 'tr', 'br', 'bl']">
    <div>只有四角手柄</div>
  </DragResize>
</template>
```

### 事件处理

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Rect } from 'vue-sample-drag-resize'

const position = ref<Rect>({ left: 0, top: 0, width: 200, height: 200 })

const onDragStop = (rect: Rect) => {
  position.value = rect
  console.log('新位置:', rect)
}
</script>

<template>
  <DragResize :x="50" :y="50" @dragstop="onDragStop">
    <div>位置: {{ position.left }}, {{ position.top }}</div>
  </DragResize>
</template>
```

### 多组件碰撞检测

```vue
<script setup lang="ts">
import { createDragResize } from 'vue-sample-drag-resize'

const app = createApp(App)
app.use(createDragResize(), { isCollision: true })
</script>

<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="50" :y="50" :w="150" :h="150">
      <div>组件 1</div>
    </DragResize>
    <DragResize :x="250" :y="50" :w="150" :h="150">
      <div>组件 2</div>
    </DragResize>
  </div>
</template>
```

## TypeScript 支持

本库使用 TypeScript 编写，提供完整的类型定义。

```typescript
import type { DragResizeProps, Rect, Stick, Axis, Options, DragResizePlugin } from 'vue-sample-drag-resize'
```

## 浏览器支持

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产环境构建
npm run build

# 构建库
npm run build:lib

# 类型检查
npm run type-check
```

## 贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 许可证

[MIT](./LICENSE) © 2025
