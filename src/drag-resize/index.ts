import type { App } from 'vue'
import DragResize from './drag-resize.vue'
import { DragResizeManager } from './manager'

export type Options = {
  isCollision?: boolean
}

export function createDragResize() {
  return (app: App, options?: Options) => {
    const dragResizeManager = new DragResizeManager(options?.isCollision)
    app.provide('dragResizeManager', dragResizeManager)
    app.component('DragResize', DragResize)
  }
}
