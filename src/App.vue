<script setup lang="ts">
</script>

<template>
  <div style="position: relative; width: 900px; height: 900px; border: 1px solid #000">
    <DragResize :x="100" :y="50" :isLimit="true"> hello world </DragResize>
  <DragResize :x="100" :y="300" :isLimit="true"> hello world </DragResize>
  </div>
</template>

<style scoped></style>
