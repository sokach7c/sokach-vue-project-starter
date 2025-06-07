<script setup>
import { ref } from 'vue';

import { createPlyrRef, usePlyr } from '@sokach-plugin/plyr';

// 使用简化的 Hook
const { PlyrVideo, createOptions } = usePlyr();

// 创建播放器引用
const playerRef = createPlyrRef();

// 音频源
const audioSrc = ref('/eona-emotional-ambient-pop-351436.mp3');

// 配置选项
const videoOptions = createOptions({
  autoplay: false,
  volume: 0.8,
  poster: '/autumn-8688876_1280.jpg',
});

const audioOptions = createOptions({
  autoplay: false,
  volume: 0.6,
});

// 事件处理
function handleReady(player) {
  console.warn('播放器已准备就绪:', player);
}

function handlePlay() {
  console.warn('开始播放');
}

function handlePause() {
  console.warn('暂停播放');
}

// 播放器控制
function playPlayer() {
  playerRef.value?.play();
}

function pausePlayer() {
  playerRef.value?.pause();
}

function stopPlayer() {
  playerRef.value?.stop();
}

function toggleMute() {
  playerRef.value?.toggleMuted();
}

function setVolume(volume) {
  playerRef.value?.setVolume(volume);
}

function forward() {
  playerRef.value?.forward(10);
}

function rewind() {
  playerRef.value?.rewind(10);
}
</script>

<template>
  <div class="simple-video-demo">
    <h2>简化版 Plyr 播放器示例</h2>

    <div class="demo-section">
      <h3>视频播放器</h3>
      <div class="player-wrapper">
        <PlyrVideo
          ref="playerRef"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          type="video"
          :options="videoOptions"
          @ready="handleReady"
          @play="handlePlay"
          @pause="handlePause"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>音频播放器</h3>
      <div class="player-wrapper">
        <PlyrVideo
          :src="audioSrc"
          type="audio"
          :options="audioOptions"
          @ready="handleReady"
          @play="handlePlay"
          @pause="handlePause"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>播放器控制</h3>
      <div class="controls">
        <button @click="playPlayer" class="btn">播放</button>
        <button @click="pausePlayer" class="btn">暂停</button>
        <button @click="stopPlayer" class="btn">停止</button>
        <button @click="toggleMute" class="btn">切换静音</button>
        <button @click="setVolume(0.3)" class="btn">音量 30%</button>
        <button @click="setVolume(0.8)" class="btn">音量 80%</button>
        <button @click="forward" class="btn">快进 10s</button>
        <button @click="rewind" class="btn">快退 10s</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>使用说明</h3>
      <div class="info">
        <p><strong>简化的特性：</strong></p>
        <ul>
          <li>✅ 使用 <code>usePlyr()</code> Hook 获取 PlyrVideo 组件</li>
          <li>✅ 通过 <code>createPlyrRef()</code> 创建播放器引用</li>
          <li>✅ 使用 <code>createOptions()</code> 创建配置选项</li>
          <li>✅ 直接使用 <code>&lt;PlyrVideo /&gt;</code> 组件</li>
          <li>✅ 支持 Props 方式传递配置</li>
          <li>✅ 暴露丰富的播放器控制方法</li>
          <li>✅ 自动处理播放器生命周期</li>
        </ul>

        <p><strong>对比原版优势：</strong></p>
        <ul>
          <li>🚀 更简洁的 API</li>
          <li>🎯 更直观的组件使用方式</li>
          <li>🔧 更好的 TypeScript 支持</li>
          <li>📦 更小的包体积</li>
          <li>⚡ 更快的开发体验</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simple-video-demo {
  max-width: 1000px;
  padding: 20px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 40px;
}

.player-wrapper {
  max-width: 900px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}

.btn:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.info {
  padding: 20px;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 8px;
}

.info ul {
  padding-left: 20px;
  margin: 10px 0;
}

.info li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.info code {
  padding: 2px 6px;
  font-family: Monaco, Consolas, monospace;
  font-size: 13px;
  background: #e9ecef;
  border-radius: 4px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h3 {
  padding-bottom: 5px;
  margin-bottom: 15px;
  color: #555;
  border-bottom: 2px solid #667eea;
}
</style>
