# Vue3 Simple Drag Resize

A lightweight Vue 3 component for draggable and resizable elements with collision detection support.

## Why Choose This Library?

- **Lightweight** - Minimal bundle size with zero dependencies (except Vue)
- **Collision Detection** - Built-in collision detection to prevent overlapping components
- **TypeScript First** - Written in TypeScript with full type definitions
- **Touch Support** - Works seamlessly on both desktop and mobile devices
- **Flexible API** - Rich props and events for complete customization

## Quick Start

```bash
npm install vue3-simple-drag-resize
```

```typescript
import { createApp } from 'vue'
import { createDragResize } from 'vue3-simple-drag-resize'

const app = createApp(App)
app.use(createDragResize(), { isCollision: true })
app.mount('#app')
```

```vue
<template>
  <div style="position: relative; width: 100%; height: 500px;">
    <DragResize :x="100" :y="100" :w="200" :h="200">
      <div>Drag and resize me!</div>
    </DragResize>
  </div>
</template>
```

## Important Notes

The component uses `position: absolute` for positioning. For it to work correctly, the parent element must have a valid positioning property (NOT `static`). Set `position: relative`, `absolute`, `fixed`, or `sticky` on the parent element.

## Key Features

- 🎯 Drag and drop with mouse and touch support
- 📐 8-direction resize handles
- 💥 Collision detection to prevent overlapping
- 🔒 Limit movement within parent container
- 📏 Min/max size constraints
- 🎨 Single axis drag restriction
- 🌐 Full TypeScript support

## License

MIT
