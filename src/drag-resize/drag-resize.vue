<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef, watch, useId, onBeforeUnmount, watchEffect, inject } from 'vue'
import type { DragResizeProps, Stick, InitDimension, DragLimitation, Rect, Collision } from './types'
import type { DragResizeManager } from './manager'

const COMPONENT_NAME = 'DragResize'
defineOptions({
  name: COMPONENT_NAME
})

const props = withDefaults(defineProps<DragResizeProps>(), {
  w: 200,
  h: 200,
  x: 0,
  y: 0,
  z: 'auto',
  isLimit: false,
  minW: 50,
  minH: 50,
  sticks: () => ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'] as Stick[],
  stickSize: 8,
  isResizable: true,
  isDraggable: true,
  axis: 'both'
})

watchEffect(() => {
  if (props.isLimit && props.w) {
    if (props.maxW && props.w > props.maxW) {
      throw new Error('isLimit is true, w cannot be greater than maxW')
    }
    if (props.minW && props.w < props.minW) {
      throw new Error('isLimit is true, w cannot be less than minW')
    }
  }
  if (props.isLimit && props.h) {
    if (props.maxH && props.h > props.maxH) {
      throw new Error('isLimit is true, h cannot be greater than maxH')
    }
    if (props.minH && props.h < props.minH) {
      throw new Error('isLimit is true, h cannot be less than minH')
    }
  }
})

const emits = defineEmits({
  clicked: () => true,
  dragging: (rect: Rect) => rect,
  dragstop: (rect: Rect) => rect,
  resizing: (rect: Rect) => rect,
  resizestop: (rect: Rect) => rect,
  collision: (collision: Collision) => collision,
  activated: () => true,
  deactivated: () => true
})

const maxWidth = ref(props.maxW ?? 0)
const maxHeight = ref(props.maxH ?? 0)
const zIndex = ref(props.z)
const left = ref(props.x)
const top = ref(props.y)
const right = ref(0)
const bottom = ref(0)

const dragResizeRef = useTemplateRef('drag-resize')
const dragResizeContainerRef = useTemplateRef('drag-resize-container')

const uid = useId()
const dragResizeManager = inject('dragResizeManager') as DragResizeManager

onMounted(() => {
  const parentElement = dragResizeRef.value?.parentElement as HTMLElement
  maxWidth.value ||= parentElement.clientWidth
  maxHeight.value ||= parentElement.clientHeight

  dragResizeManager.register(uid, dragResizeRef)

  const containerElement = dragResizeContainerRef.value as HTMLElement
  right.value = maxWidth.value - (props.w ?? containerElement.scrollWidth) - left.value
  bottom.value = maxHeight.value - (props.h ?? containerElement.scrollHeight) - top.value
})

const width = computed(() => maxWidth.value - left.value - right.value)
const height = computed(() => maxHeight.value - top.value - bottom.value)

const positionStyle = computed(() => ({
  left: left.value + 'px',
  top: top.value + 'px',
  zIndex: zIndex.value
}))

const sizeStyle = computed(() => ({
  width: width.value + 'px',
  height: height.value + 'px'
}))

const rect = computed(() => ({
  left: Math.round(left.value),
  top: Math.round(top.value),
  width: Math.round(width.value),
  height: Math.round(height.value)
}))

const stickStyle = computed(() => (stick: Stick) => {
  const keyX = { l: 'left', m: 'marginLeft', r: 'right' }
  const keyY = { t: 'top', m: 'marginTop', b: 'bottom' }
  return {
    width: `${props.stickSize}px`,
    height: `${props.stickSize}px`,
    [keyX[stick[1] as keyof typeof keyX]]: `${props.stickSize / -2}px`,
    [keyY[stick[0] as keyof typeof keyY]]: `${props.stickSize / -2}px`
  }
})

let initDimension: InitDimension | null = null
let limits: DragLimitation | null = null
let bodyDragging = false
let stickDragging = false
let currentStick: Stick
const isActive = ref(false)

const calcInitDimension = (pointerX: number, pointerY: number): InitDimension => ({
  pointerX,
  pointerY,
  left: left.value,
  top: top.value,
  right: right.value,
  bottom: bottom.value,
  width: width.value,
  height: height.value
})

const calcMoveLimitation = (): DragLimitation => ({
  left: { min: 0, max: maxWidth.value - width.value },
  right: { min: 0, max: maxWidth.value - width.value },
  top: { min: 0, max: maxHeight.value - height.value },
  bottom: { min: 0, max: maxHeight.value - height.value }
})

const calcResizeLimition = (): DragLimitation => ({
  left: { min: 0, max: left.value + (width.value - props.minW) },
  right: { min: 0, max: right.value + (width.value - props.minW) },
  top: { min: 0, max: top.value + (height.value - props.minH) },
  bottom: { min: 0, max: bottom.value + (height.value - props.minH) }
})

const calcBeforeDrag = (pointerX: number, pointerY: number, isMove: boolean) => {
  initDimension = calcInitDimension(pointerX, pointerY)
  limits = isMove ? calcMoveLimitation() : calcResizeLimition()
}

const bodyDown = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation()
  event.preventDefault()

  isActive.value = true

  if (props.isDraggable) {
    bodyDragging = true
  }

  const pointerX = 'pageX' in event ? event.pageX : ((event as TouchEvent).touches[0]?.pageX ?? 0)
  const pointerY = 'pageY' in event ? event.pageY : ((event as TouchEvent).touches[0]?.pageY ?? 0)

  calcBeforeDrag(pointerX, pointerY, true)

  emits('clicked')
}

const bodyUp = () => {
  bodyDragging = false
  initDimension = null
  limits = null
  emits('dragging', rect.value)
  emits('dragstop', rect.value)
}

const bodyMove = (offset: { x: number; y: number }) => {
  let newTop = initDimension!.top - offset.y
  let newBottom = initDimension!.bottom + offset.y
  let newLeft = initDimension!.left - offset.x
  let newRight = initDimension!.right + offset.x

  ;({ newLeft, newRight, newTop, newBottom } = rectCorrectionByLimits(newLeft, newRight, newTop, newBottom))

  const collision = dragResizeManager.willCollide(uid, { left: newLeft, top: newTop, right: newRight, bottom: newBottom })
  if (collision) {
    emits('collision', collision)
    if (collision.boundary === 'left') {
      newLeft -= collision.overlap
      newRight += collision.overlap
    }
    if (collision.boundary === 'right') {
      newLeft += collision.overlap
      newRight -= collision.overlap
    }
    if (collision.boundary === 'top') {
      newTop -= collision.overlap
      newBottom += collision.overlap
    }
    if (collision.boundary === 'bottom') {
      newTop += collision.overlap
      newBottom -= collision.overlap
    }
  }

  left.value = newLeft
  right.value = newRight
  top.value = newTop
  bottom.value = newBottom

  emits('dragging', rect.value)
}

const stickDown = (stick: Stick, event: MouseEvent | TouchEvent) => {
  if (!(props.isResizable && isActive.value)) {
    return
  }

  currentStick = stick

  if (props.isDraggable) {
    stickDragging = true
  }

  const pointerX = 'pageX' in event ? event.pageX : ((event as TouchEvent).touches[0]?.pageX ?? 0)
  const pointerY = 'pageY' in event ? event.pageY : ((event as TouchEvent).touches[0]?.pageY ?? 0)

  calcBeforeDrag(pointerX, pointerY, false)
}

const stickUp = () => {
  stickDragging = false
  initDimension = null
  limits = null
  emits('resizing', rect.value)
  emits('resizestop', rect.value)
}

const stickMove = (offset: { x: number; y: number }) => {
  let newTop = initDimension!.top
  let newBottom = initDimension!.bottom
  let newLeft = initDimension!.left
  let newRight = initDimension!.right
  switch (currentStick[0]) {
    case 'b':
      newBottom += offset.y
      break
    case 't':
      newTop -= offset.y
  }
  switch (currentStick[1]) {
    case 'r':
      newRight += offset.x
      break
    case 'l':
      newLeft -= offset.x
  }

  ;({ newLeft, newRight, newTop, newBottom } = rectCorrectionByLimits(newLeft, newRight, newTop, newBottom))

  const collision = dragResizeManager.willCollide(uid, { left: newLeft, top: newTop, right: newRight, bottom: newBottom })
  if (collision) {
    emits('collision', collision)
    if (collision.boundary === 'left') {
      newRight += collision.overlap
    }
    if (collision.boundary === 'right') {
      newLeft += collision.overlap
    }
    if (collision.boundary === 'top') {
      newBottom += collision.overlap
    }
    if (collision.boundary === 'bottom') {
      newTop += collision.overlap
    }
  }

  left.value = newLeft
  right.value = newRight
  top.value = newTop
  bottom.value = newBottom

  emits('resizing', rect.value)
}

const rectCorrectionByLimits = (newLeft: number, newRight: number, newTop: number, newBottom: number) => {
  if (!limits || !props.isLimit) {
    return { newLeft, newRight, newTop, newBottom }
  }
  return {
    newLeft: Math.min(Math.max(newLeft, limits.left.min), limits.left.max),
    newRight: Math.min(Math.max(newRight, limits.right.min), limits.right.max),
    newTop: Math.min(Math.max(newTop, limits.top.min), limits.top.max),
    newBottom: Math.min(Math.max(newBottom, limits.bottom.min), limits.bottom.max)
  }
}

const move = (event: MouseEvent | TouchEvent) => {
  if (!stickDragging && !bodyDragging) {
    return
  }

  event.stopPropagation()

  const pointerX = 'pageX' in event ? event.pageX : ((event as TouchEvent).touches[0]?.pageX ?? 0)
  const pointerY = 'pageY' in event ? event.pageY : ((event as TouchEvent).touches[0]?.pageY ?? 0)

  const offset = {
    x: initDimension!.pointerX - pointerX,
    y: initDimension!.pointerY - pointerY
  }

  if (stickDragging) {
    stickMove(offset)
  }

  if (bodyDragging) {
    if (props.axis === 'x') {
      offset.y = 0
    } else if (props.axis === 'y') {
      offset.x = 0
    }
    bodyMove(offset)
  }
}

const up = () => {
  if (stickDragging) {
    stickUp()
  } else if (bodyDragging) {
    bodyUp()
  }
}

const addEvents = function (events: Map<string, EventListener>) {
  events.forEach((callback, eventName) => {
    document.documentElement.addEventListener(eventName, callback)
  })
}

const removeEvents = function (events: Map<string, EventListener>) {
  events.forEach((callback, eventName) => {
    document.documentElement.removeEventListener(eventName, callback)
  })
}

onMounted(() => {
  const domEvents = new Map([
    ['mousemove', move as EventListener],
    ['mouseup', up as EventListener],
    ['mouseleave', up as EventListener],
    ['mousedown', (() => (isActive.value = false)) as EventListener],
    ['touchmove', move as EventListener],
    ['touchend', up as EventListener],
    ['touchcancel', up as EventListener],
    ['touchstart', up as EventListener]
  ])

  addEvents(domEvents)

  onBeforeUnmount(() => {
    removeEvents(domEvents)
    dragResizeManager.unregister(uid)
  })
})

watch(
  () => props.maxW,
  (newVal) => {
    if (newVal) {
      maxWidth.value = newVal
      right.value = newVal - width.value - left.value
    }
  }
)

watch(
  () => props.maxH,
  (newVal) => {
    if (newVal) {
      maxHeight.value = newVal
      bottom.value = newVal - height.value - top.value
    }
  }
)

watch(
  () => props.x,
  (newVal, oldVal) => {
    if (stickDragging || bodyDragging || newVal === left.value) {
      return
    }
    const offsetX = oldVal - newVal
    calcBeforeDrag(left.value, top.value, true)
    bodyMove({ x: offsetX, y: 0 })
    bodyUp()
  }
)

watch(
  () => props.y,
  (newVal, oldVal) => {
    if (stickDragging || bodyDragging || newVal === top.value) {
      return
    }
    const offsetY = oldVal - newVal
    calcBeforeDrag(left.value, top.value, true)
    bodyMove({ x: 0, y: offsetY })
    bodyUp()
  }
)

watch(
  () => props.z,
  (newVal) => (zIndex.value = newVal)
)

watch(
  () => props.w,
  (newVal, oldVal) => {
    if (stickDragging || bodyDragging || newVal === width.value) {
      return
    }
    currentStick = 'mr' as Stick
    const offsetX = (oldVal as number) - (newVal as number)
    calcBeforeDrag(right.value, top.value + height.value / 2, false)
    stickMove({ x: offsetX, y: 0 })
    stickUp()
  }
)

watch(
  () => props.h,
  (newVal, oldVal) => {
    if (stickDragging || bodyDragging || newVal === height.value) {
      return
    }
    currentStick = 'bm' as Stick
    const offsetY = (oldVal as number) - (newVal as number)
    calcBeforeDrag(left.value + width.value / 2, bottom.value, false)
    stickMove({ x: 0, y: offsetY })
    stickUp()
  }
)

watch(isActive, (newVal) => (newVal ? emits('activated') : emits('deactivated')))
</script>

<template>
  <div
    class="drag-resize"
    :class="`${isActive ? 'active' : 'inactive'}`"
    ref="drag-resize"
    :style="positionStyle"
    @mousedown="bodyDown($event)"
    @touchstart="bodyDown($event)"
    @touchend="up()"
  >
    <div class="drag-resize-container" ref="drag-resize-container" :style="sizeStyle">
      <slot></slot>
    </div>
    <div
      v-for="stick in sticks"
      :style="stickStyle(stick)"
      class="drag-resize-stick"
      :class="['drag-resize-stick-' + stick, isResizable ? '' : 'not-resizable']"
      @mousedown.stop.prevent="stickDown(stick, $event)"
      @touchstart.stop.prevent="stickDown(stick, $event)"
      @touchend="up()"
    ></div>
  </div>
</template>

<style scoped>
.drag-resize {
  position: absolute;
  box-sizing: border-box;
}
.drag-resize.active:before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  outline: 1px dashed #d6d6d6;
}
.drag-resize-stick {
  box-sizing: border-box;
  position: absolute;
  font-size: 1px;
  background: #ffffff;
  border: 1px solid #6c6c6c;
  box-shadow: 0 0 2px #bbb;
}
.inactive .drag-resize-stick {
  display: none;
}
.drag-resize-stick-tl,
.drag-resize-stick-br {
  cursor: nwse-resize;
}
.drag-resize-stick-tm,
.drag-resize-stick-bm {
  left: 50%;
  cursor: ns-resize;
}
.drag-resize-stick-tr,
.drag-resize-stick-bl {
  cursor: nesw-resize;
}
.drag-resize-stick-ml,
.drag-resize-stick-mr {
  top: 50%;
  cursor: ew-resize;
}
.drag-resize-stick.not-resizable {
  display: none;
}
.drag-resize-container {
  display: block;
  position: relative;
}
</style>
