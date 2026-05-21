import type { TemplateRef } from 'vue'
import type { ClientRect, Collision } from './types.ts'

export class DragResizeManager {
  private isCollision: boolean = false

  private components: Map<string, TemplateRef<HTMLDivElement>> = new Map()

  constructor(isCollision: boolean = false) {
    this.isCollision = isCollision
  }

  register(id: string, rectRef: TemplateRef<HTMLDivElement>) {
    this.components.set(id, rectRef)
  }

  unregister(id: string) {
    this.components.delete(id)
  }

  getCurrentComponent(currentId: string): TemplateRef<HTMLDivElement> | undefined {
    return this.components.get(currentId)
  }

  getOtherComponents(currentId: string): TemplateRef<HTMLDivElement>[] {
    const others: TemplateRef<HTMLDivElement>[] = []
    this.components.forEach((rectRef, id) => {
      if (id !== currentId) {
        others.push(rectRef)
      }
    })
    return others
  }

  checkCollision(rect1: ClientRect, rect2: ClientRect): boolean {
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)
  }

  willCollide(currentId: string, newRect: ClientRect): Collision | null {
    if (!this.isCollision) return null
    const currentComponent = this.getCurrentComponent(currentId)
    if (!currentComponent?.value) return null

    const parentRect = currentComponent.value.parentElement?.getBoundingClientRect()
    if (!parentRect) return null

    const newViewportRect: ClientRect = {
      left: parentRect.left + newRect.left,
      top: parentRect.top + newRect.top,
      right: parentRect.right - newRect.right,
      bottom: parentRect.bottom - newRect.bottom
    }

    const otherComponents = this.getOtherComponents(currentId)
    for (const other of otherComponents) {
      if (!other.value) continue
      const otherRect = other.value.getBoundingClientRect()
      if (this.checkCollision(newViewportRect, otherRect)) {
        const overlapLeft = newViewportRect.right - otherRect.left;    
        const overlapRight = otherRect.right - newViewportRect.left;   
        const overlapTop = newViewportRect.bottom - otherRect.top;     
        const overlapBottom = otherRect.bottom - newViewportRect.top;
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        if (minOverlap === overlapLeft) {
          return {
            boundary: 'left',
            overlap: overlapLeft
          }
        }
        if (minOverlap === overlapRight) {
          return {
            boundary: 'right',
            overlap: overlapRight
          }
        }
        if (minOverlap === overlapTop) {
          return {
            boundary: 'top',
            overlap: overlapTop
          }
        }
        if (minOverlap === overlapBottom) {
          return {
            boundary: 'bottom',
            overlap: overlapBottom
          }
        }
      }
    }
    return null
  }
}
