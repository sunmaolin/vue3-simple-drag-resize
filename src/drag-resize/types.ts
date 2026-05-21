export type Stick = 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'br' | 'bm' | 'bl'
export type Axis = 'x' | 'y' | 'both'
export type ClientRect = {
  left: number
  top: number
  right: number
  bottom: number
}
export type InitDimension = {
  pointerX: number
  pointerY: number
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}
export type DragLimitation = {
  left: { min: number; max: number }
  right: { min: number; max: number }
  top: { min: number; max: number }
  bottom: { min: number; max: number }
}
export type Collision = {
  boundary: 'left' | 'right' | 'top' | 'bottom'
  overlap: number
} 
export type Rect = {
  left: number
  top: number
  width: number
  height: number
}

export interface DragResizeProps {
  w?: number
  h?: number
  x?: number
  y?: number
  z?: number | 'auto'
  isLimit?: boolean
  maxW?: number
  maxH?: number
  minW?: number
  minH?: number
  sticks?: Stick[]
  stickSize?: number
  isResizable?: boolean
  isDraggable?: boolean
  axis?: Axis
}
