<script setup lang="ts"></script>

<template>
  <div style="position: relative; width: 900px; height: 500px; border: 1px solid #000">
    <DragResize :x="100" :y="50" :isLimit="true">
      <div>Hello World</div>
    </DragResize>
    <DragResize :x="400" :y="50" :isLimit="true">
      <div>Hello World</div>
    </DragResize>
  </div>
</template>

<style scoped>
:deep(.drag-resize) {
  border-radius: 5px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
:deep(.drag-resize-container) {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
