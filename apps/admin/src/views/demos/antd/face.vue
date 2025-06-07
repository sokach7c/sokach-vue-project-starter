<script setup lang="ts">
import { computed, ref } from 'vue';

import { FaceDetection } from '@sokach-plugin/face';

const faceDetectionRef = ref();
const faceCount = ref(0);
const cameraStatus = ref('stopped');
const latestPhoto = ref<null | string>(null);
const errorMsg = ref<null | string>(null);

// 计算属性
const canTakePhoto = computed(() => {
  return cameraStatus.value === 'running' && faceCount.value === 1;
});

// 获取人脸状态描述
const getFaceStatus = () => {
  if (faceCount.value === 0) return '无人脸';
  if (faceCount.value === 1) return '1人';
  return `${faceCount.value}人，需要1人`;
};

// 事件处理
const onDetection = (results: Results) => {
  faceCount.value = results.detections?.length || 0;
  errorMsg.value = null; // 清除错误信息
};

const onError = (error: Error) => {
  errorMsg.value = `错误: ${error.message}`;
};

const onCameraStatus = (status: string) => {
  cameraStatus.value = status;
};

const onPhotoTaken = (imageData: string) => {
  latestPhoto.value = imageData;
  errorMsg.value = null;
};

// 拍照方法
const takePhoto = () => {
  if (faceDetectionRef.value) {
    const result = faceDetectionRef.value.takePhoto();
    if (!result.success) {
      errorMsg.value = result.error || '拍照失败';
    }
  }
};

// 下载照片
const downloadPhoto = () => {
  if (latestPhoto.value) {
    const link = document.createElement('a');
    link.href = latestPhoto.value;
    link.download = `face-photo-${Date.now()}.jpg`;
    link.click();
  }
};
</script>

<template>
  <div class="photo-demo">
    <h2>人脸检测拍照演示</h2>

    <div class="demo-section">
      <FaceDetection
        ref="faceDetectionRef"
        :width="640"
        :height="480"
        @detection="onDetection"
        @error="onError"
        @camera-status="onCameraStatus"
        @photo-taken="onPhotoTaken"
      />

      <div class="controls">
        <button
          @click="takePhoto"
          :disabled="!canTakePhoto"
          :class="{ active: canTakePhoto }"
        >
          📸 拍照 {{ faceCount === 1 ? '(准备就绪)' : `(${getFaceStatus()})` }}
        </button>

        <div class="status">
          <span>状态: {{ cameraStatus }}</span>
          <span>人脸: {{ faceCount }}</span>
          <span :class="{ ready: canTakePhoto }">
            {{ canTakePhoto ? '✅ 可拍照' : '❌ 不可拍照' }}
          </span>
        </div>
      </div>

      <!-- 最新照片预览 -->
      <div v-if="latestPhoto" class="photo-preview">
        <h3>最新照片</h3>
        <img :src="latestPhoto" alt="拍摄的照片" class="photo" />
        <button @click="downloadPhoto" class="download-btn">下载照片</button>
      </div>

      <!-- 错误信息 -->
      <div v-if="errorMsg" class="error">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-demo {
  max-width: 800px;
  padding: 20px;
  margin: 20px auto;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.controls button {
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  background: #6c757d;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.controls button.active {
  background: #28a745;
  box-shadow: 0 0 15px rgb(40 167 69 / 50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.status {
  display: flex;
  gap: 15px;
  padding: 10px 15px;
  font-size: 14px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status span.ready {
  font-weight: bold;
  color: #28a745;
}

.photo-preview {
  padding: 15px;
  text-align: center;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.photo {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.download-btn {
  padding: 8px 16px;
  margin-top: 10px;
  color: white;
  cursor: pointer;
  background: #007bff;
  border: none;
  border-radius: 4px;
}

.download-btn:hover {
  background: #0056b3;
}

.error {
  padding: 10px 15px;
  color: #721c24;
  text-align: center;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
