# vue3-simple-drag-resize

[![npm version](https://img.shields.io/npm/v/vue3-simple-drag-resize.svg)](https://www.npmjs.com/package/vue3-simple-drag-resize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)

A lightweight Vue 3 component for draggable and resizable elements with collision detection.

English | [简体中文](./README.zh-CN.md)

**GitHub Repository**: [https://github.com/sunmaolin/vue3-simple-drag-resize](https://github.com/sunmaolin/vue3-simple-drag-resize)

## Demo

https://github.com/user-attachments/assets/d3e1d4a5-6c0b-4e22-b9d0-05c388a6c321

## Features

- 🎯 **Drag and Drop** - Smooth drag support with mouse and touch events
- 📐 **Resize** - 8-direction resize handles (corners and edges)
- 💥 **Collision Detection** - Prevent components from overlapping
- 🔒 **Limit to Parent** - Constrain movement within parent container
- 📏 **Size Constraints** - Set minimum and maximum width/height
- 🎨 **Axis Restriction** - Restrict drag to horizontal or vertical axis
- 📱 **Touch Support** - Works on mobile devices
- 🌐 **TypeScript** - Full TypeScript support with type definitions
- 🎭 **Flexible API** - Rich props and events for customization

## Installation

```bash
npm install vue3-simple-drag-resize
```

```bash
yarn add vue3-simple-drag-resize
```

```bash
pnpm add vue3-simple-drag-resize
```

## Quick Start

### Global Registration

```typescript
import { createApp } from 'vue'
import { createDragResize } from 'vue3-simple-drag-resize'

const app = createApp(App)
app.use(createDragResize(), { isCollision: true })
app.mount('#app')
```

### Local Registration

```vue
<script setup lang="ts">
import { DragResize } from 'vue3-simple-drag-resize'
</script>

<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="100" :y="100" :w="200" :h="200">
      <div>Drag me!</div>
    </DragResize>
  </div>
</template>
```

## Important Notes

The component uses `position: absolute` for positioning. For it to work correctly, the parent element must have a valid positioning property.

⚠️ **The parent element's `position` must NOT be `static` (the default value)**

Make sure the parent element has one of the following positioning properties:

- `position: relative` (recommended)
- `position: absolute`
- `position: fixed`
- `position: sticky`

```vue
<template>
  <!-- ✅ Correct: Parent has position: relative -->
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="100" :y="100">
      <div>Works correctly</div>
    </DragResize>
  </div>

  <!-- ❌ Wrong: Parent uses default position: static -->
  <div style="width: 100%; height: 500px;">
    <DragResize :x="100" :y="100">
      <div>Positioning will be relative to an ancestor element</div>
    </DragResize>
  </div>
</template>
```

## Props

| Prop          | Type                   | Default                                            | Description                                |
| ------------- | ---------------------- | -------------------------------------------------- | ------------------------------------------ |
| `x`           | `number`               | `0`                                                | Initial left position (relative to parent) |
| `y`           | `number`               | `0`                                                | Initial top position (relative to parent)  |
| `w`           | `number`               | `200`                                              | Width of the component                     |
| `h`           | `number`               | `200`                                              | Height of the component                    |
| `z`           | `number \| 'auto'`     | `'auto'`                                           | z-index of the component                   |
| `isLimit`     | `boolean`              | `false`                                            | Limit movement within parent container     |
| `maxW`        | `number`               | -                                                  | Maximum width                              |
| `maxH`        | `number`               | -                                                  | Maximum height                             |
| `minW`        | `number`               | `50`                                               | Minimum width                              |
| `minH`        | `number`               | `50`                                               | Minimum height                             |
| `sticks`      | `Stick[]`              | `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']` | Array of resize handles                    |
| `stickSize`   | `number`               | `8`                                                | Size of resize handles in pixels           |
| `isResizable` | `boolean`              | `true`                                             | Enable/disable resizing                    |
| `isDraggable` | `boolean`              | `true`                                             | Enable/disable dragging                    |
| `axis`        | `'x' \| 'y' \| 'both'` | `'both'`                                           | Restrict drag direction                    |
| `prefix`      | `string`               | -                                                  | Prefix for collision detection grouping    |

### Stick Types

| Stick | Position            |
| ----- | ------------------- |
| `tl`  | Top-left corner     |
| `tm`  | Top-middle edge     |
| `tr`  | Top-right corner    |
| `mr`  | Middle-right edge   |
| `br`  | Bottom-right corner |
| `bm`  | Bottom-middle edge  |
| `bl`  | Bottom-left corner  |
| `ml`  | Middle-left edge    |

## Events

| Event         | Payload     | Description                             |
| ------------- | ----------- | --------------------------------------- |
| `clicked`     | -           | Emitted when component is clicked       |
| `dragging`    | `Rect`      | Emitted during drag                     |
| `dragstop`    | `Rect`      | Emitted when drag ends                  |
| `resizing`    | `Rect`      | Emitted during resize                   |
| `resizestop`  | `Rect`      | Emitted when resize ends                |
| `activated`   | -           | Emitted when component becomes active   |
| `deactivated` | -           | Emitted when component becomes inactive |
| `collision`   | `Collision` | Emitted when component collision occurs |

### Rect Type

```typescript
interface Rect {
  left: number
  top: number
  width: number
  height: number
}
```

### Collision Type

```typescript
interface Collision {
  boundary: 'left' | 'right' | 'top' | 'bottom'
  overlap: number
}
```

- `boundary`: The boundary direction where collision occurred
- `overlap`: The collision overlap amount in pixels

## Collision Detection

Enable collision detection to prevent components from overlapping:

```typescript
app.use(createDragResize(), { isCollision: true })
```

When enabled, components will automatically prevent overlapping during drag and resize operations. The collision detection uses viewport coordinates to handle components with different parent elements correctly.

## Usage Examples

### Basic Usage

```vue
<template>
  <div class="container">
    <DragResize :x="50" :y="50" :w="150" :h="150">
      <div class="content">Basic Component</div>
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

### Limit to Parent Container

```vue
<template>
  <DragResize :x="10" :y="10" :w="100" :h="100" :is-limit="true">
    <div>Limited to parent</div>
  </DragResize>
</template>
```

### Min/Max Size Constraints

```vue
<template>
  <DragResize :x="50" :y="50" :w="150" :h="150" :min-w="100" :min-h="100" :max-w="300" :max-h="300">
    <div>Constrained size</div>
  </DragResize>
</template>
```

### Single Axis Drag

```vue
<template>
  <DragResize :x="50" :y="50" axis="x">
    <div>Only horizontal drag</div>
  </DragResize>
</template>
```

### Custom Resize Handles

```vue
<template>
  <DragResize :sticks="['tl', 'tr', 'br', 'bl']">
    <div>Only corner handles</div>
  </DragResize>
</template>
```

### Event Handling

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Rect } from 'vue3-simple-drag-resize'

const position = ref<Rect>({ left: 0, top: 0, width: 200, height: 200 })

const onDragStop = (rect: Rect) => {
  position.value = rect
  console.log('New position:', rect)
}
</script>

<template>
  <DragResize :x="50" :y="50" @dragstop="onDragStop">
    <div>Position: {{ position.left }}, {{ position.top }}</div>
  </DragResize>
</template>
```

### Multiple Components with Collision Detection

```vue
<script setup lang="ts">
import { createDragResize } from 'vue3-simple-drag-resize'

const app = createApp(App)
app.use(createDragResize(), { isCollision: true })
</script>

<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="50" :y="50" :w="150" :h="150">
      <div>Component 1</div>
    </DragResize>
    <DragResize :x="250" :y="50" :w="150" :h="150">
      <div>Component 2</div>
    </DragResize>
  </div>
</template>
```

### Layer-based Collision Detection with Prefix

Use the `prefix` prop to group components for collision detection. Only components with the same prefix will collide with each other, allowing you to create separate collision layers:

```vue
<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <!-- Layer 1: Components with prefix="layer1" will only collide with each other -->
    <DragResize prefix="layer1" :x="50" :y="50" :w="150" :h="150">
      <div>Layer 1 - Component A</div>
    </DragResize>
    <DragResize prefix="layer1" :x="250" :y="50" :w="150" :h="150">
      <div>Layer 1 - Component B</div>
    </DragResize>

    <!-- Layer 2: Components with prefix="layer2" will only collide with each other -->
    <DragResize prefix="layer2" :x="50" :y="300" :w="150" :h="150">
      <div>Layer 2 - Component A</div>
    </DragResize>
    <DragResize prefix="layer2" :x="250" :y="300" :w="150" :h="150">
      <div>Layer 2 - Component B</div>
    </DragResize>

    <!-- No prefix: Components without prefix will collide with all other non-prefixed components -->
    <DragResize :x="450" :y="50" :w="150" :h="150">
      <div>Default Layer Component</div>
    </DragResize>
  </div>
</template>
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions.

```typescript
import type { DragResizeProps, Rect, Stick, Axis, Options, DragResizePlugin } from 'vue3-simple-drag-resize'
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build library
npm run build:lib

# Type check
npm run type-check
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](./LICENSE) © 2025
