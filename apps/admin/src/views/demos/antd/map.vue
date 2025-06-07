<script setup lang="ts">
import { useAmap } from '@sokach-plugin/amap';

const [Amap] = useAmap({
  plugins: ['AMap.Scale'],
  options: {
    viewMode: '2D', // 默认使用 2D 模式
    zoom: 11, // 地图级别
    center: [116.397_428, 39.909_23], // 地图中心点
  },
});
</script>

<template>
  <div class="h-full w-full">
    <Amap />
  </div>
</template>

<style scoped></style>
