<script setup lang="ts">
import type { Results } from '@mediapipe/face_detection';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  watch,
} from 'vue';

import { Camera } from '@mediapipe/camera_utils';
import { FaceDetection } from '@mediapipe/face_detection';

interface Props {
  // 是否自动开始
  autoStart?: boolean;
  // 边界框样式
  boundingBoxStyle?: {
    lineWidth?: number;
    strokeStyle?: string;
  };
  height?: number;
  // 最小检测置信度
  minDetectionConfidence?: number;
  // 检测模型类型
  model?: 'full' | 'short';
  // 是否显示边界框
  showBoundingBox?: boolean;
  // 画布尺寸
  width?: number;
}

interface DetectionResult {
  faceCount: number;
  faceDetected: boolean;
  imageData?: string; // 自动拍照的base64图片数据
  results: Results;
}

interface Emits {
  // 检测结果回调（包含自动拍照数据）
  (e: 'detection', data: DetectionResult): void;
  // 错误回调
  (e: 'error', error: Error): void;
  // 加载状态变化
  (e: 'loading', isLoading: boolean): void;
  // 相机状态变化
  (
    e: 'cameraStatus',
    status: 'error' | 'running' | 'starting' | 'stopped',
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  model: 'short',
  minDetectionConfidence: 0.9,
  width: 640,
  height: 480,
  showBoundingBox: true,
  boundingBoxStyle: () => ({
    strokeStyle: '#00ff00',
    lineWidth: 2,
  }),
  autoStart: true,
});

const emit = defineEmits<Emits>();

// 响应式状态
const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();
const isLoading = ref(false);
const error = ref<null | string>(null);
const isInitialized = ref(false);
const detectionCount = ref(0);
const cameraStatus = ref<'error' | 'running' | 'starting' | 'stopped'>(
  'stopped',
);
const faceDetectionSuccess = ref(false);
const successTimeout = ref<null | number>(null);
const capturedImage = ref<string>('');

// MediaPipe 实例
let camera: Camera | null = null;
let faceDetection: FaceDetection | null = null;

// 计算属性
const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));

// 初始化人脸检测
const initializeFaceDetection = async (): Promise<void> => {
  try {
    isLoading.value = true;
    emit('loading', true);
    error.value = null;

    faceDetection = new FaceDetection({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: props.model,
      minDetectionConfidence: props.minDetectionConfidence,
    });

    faceDetection.onResults(onResults);

    isInitialized.value = true;
  } catch (error_) {
    const errorObj =
      error_ instanceof Error ? error_ : new Error('初始化人脸检测失败');
    error.value = errorObj.message;
    emit('error', errorObj);
    console.error('人脸检测初始化失败:', error_);
  } finally {
    isLoading.value = false;
    emit('loading', false);
  }
};

// 处理检测结果
const onResults = (results: Results): void => {
  try {
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.value;

    if (!canvas || !ctx || !video) {
      return;
    }

    // 清除画布并绘制视频帧
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    const faceDetected = results.detections && results.detections.length > 0;
    const faceCount = faceDetected ? results.detections.length : 0;

    // 更新检测计数
    detectionCount.value = faceCount;

    // 绘制检测结果
    if (faceDetected && props.showBoundingBox) {
      drawBoundingBoxes(ctx, results.detections, canvas);
    }

    ctx.restore();

    // 准备检测结果数据
    const detectionData: DetectionResult = {
      results,
      faceDetected,
      faceCount,
    };

    // 自动拍照逻辑：只有检测到恰好一个人脸时才拍照
    if (faceDetected && faceCount === 1) {
      try {
        // 创建新的canvas来生成照片（不包含人脸框）
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = props.width;
        photoCanvas.height = props.height;
        const photoCtx = photoCanvas.getContext('2d');

        if (photoCtx) {
          // 直接从视频元素绘制到新画布
          photoCtx.drawImage(
            video,
            0,
            0,
            photoCanvas.width,
            photoCanvas.height,
          );

          // 转换为base64
          const imageData = photoCanvas.toDataURL('image/jpeg', 0.9);
          detectionData.imageData = imageData;

          // 保存拍照结果并显示检测成功状态
          capturedImage.value = imageData;
          faceDetectionSuccess.value = true;

          // 发送检测结果（包含自动拍照数据）
          emit('detection', detectionData);

          // 拍照成功后停止检测, 将canvasRef.value的base64图片数据返回
          stopDetection();
        }
      } catch (photoError) {
        console.warn('自动拍照失败:', photoError);
      }
    }
  } catch (error_) {
    const errorObj =
      error_ instanceof Error ? error_ : new Error('处理检测结果时出错');
    console.error('处理检测结果失败:', error_);
    emit('error', errorObj);
  }
};

// 绘制边界框
const drawBoundingBoxes = (
  ctx: CanvasRenderingContext2D,
  detections: any[],
  canvas: HTMLCanvasElement,
): void => {
  ctx.strokeStyle = props.boundingBoxStyle.strokeStyle || '#00ff00';
  ctx.lineWidth = props.boundingBoxStyle.lineWidth || 2;

  for (const detection of detections) {
    const bbox = detection.boundingBox;
    const x = bbox.xCenter * canvas.width - (bbox.width * canvas.width) / 2;
    const y = bbox.yCenter * canvas.height - (bbox.height * canvas.height) / 2;
    const width = bbox.width * canvas.width;
    const height = bbox.height * canvas.height;

    ctx.strokeRect(x, y, width, height);

    // 显示置信度
    if (detection.score && detection.score.length > 0) {
      const confidence = Math.round(detection.score[0] * 100);
      ctx.fillStyle = props.boundingBoxStyle.strokeStyle || '#00ff00';
      ctx.font = '14px Arial';
      ctx.fillText(`${confidence}%`, x, y - 5);
    }
  }
};

// 初始化相机
const initializeCamera = async (): Promise<void> => {
  try {
    if (!videoRef.value || !faceDetection) {
      throw new Error('视频元素或人脸检测未初始化');
    }

    cameraStatus.value = 'starting';
    emit('cameraStatus', 'starting');

    camera = new Camera(videoRef.value, {
      onFrame: async () => {
        if (faceDetection && videoRef.value) {
          await faceDetection.send({ image: videoRef.value });
        }
      },
      width: props.width,
      height: props.height,
    });

    await camera.start();
    cameraStatus.value = 'running';
    emit('cameraStatus', 'running');
  } catch (error_) {
    cameraStatus.value = 'error';
    emit('cameraStatus', 'error');
    const errorObj =
      error_ instanceof Error ? error_ : new Error('初始化相机失败');
    error.value = errorObj.message;
    emit('error', errorObj);
    console.error('相机初始化失败:', error_);
  }
};

// 启动检测
const startDetection = async (): Promise<void> => {
  try {
    if (!isInitialized.value) {
      await initializeFaceDetection();
    }

    if (isInitialized.value && cameraStatus.value === 'stopped') {
      await initializeCamera();
    }
  } catch (error_) {
    console.error('启动检测失败:', error_);
  }
};

// 停止检测
const stopDetection = (): void => {
  try {
    if (camera) {
      camera.stop();
      camera = null;
    }
    cameraStatus.value = 'stopped';
    emit('cameraStatus', 'stopped');
  } catch (error_) {
    console.error('停止检测失败:', error_);
  }
};

// 重置检测状态（用于重新开始检测）
const resetDetection = (): void => {
  faceDetectionSuccess.value = false;
  capturedImage.value = '';
  detectionCount.value = 0;
};

// 切换检测状态
const toggleDetection = async (): Promise<void> => {
  if (cameraStatus.value === 'running') {
    stopDetection();
  } else {
    await startDetection();
  }
};

// 监听配置变化
watch([() => props.model, () => props.minDetectionConfidence], async () => {
  if (isInitialized.value && faceDetection) {
    faceDetection.setOptions({
      model: props.model,
      minDetectionConfidence: props.minDetectionConfidence,
    });
  }
});

// 组件挂载
onMounted(async () => {
  try {
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.width = props.width;
      canvas.height = props.height;
    }

    if (props.autoStart) {
      await startDetection();
    }
  } catch (error_) {
    console.error('组件挂载失败:', error_);
  }
});

// 组件卸载
onBeforeUnmount(() => {
  stopDetection();
  if (faceDetection) {
    faceDetection.close();
    faceDetection = null;
  }

  // 清理定时器
  if (successTimeout.value) {
    clearTimeout(successTimeout.value);
    successTimeout.value = null;
  }
});

// 暴露方法给父组件
defineExpose({
  startDetection,
  stopDetection,
  toggleDetection,
  resetDetection,
  isLoading: readonly(isLoading),
  error: readonly(error),
  detectionCount: readonly(detectionCount),
  cameraStatus: readonly(cameraStatus),
  faceDetectionSuccess: readonly(faceDetectionSuccess),
  capturedImage: readonly(capturedImage),
});
</script>

<template>
  <div class="face-detection-container" :style="containerStyle">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <p>正在初始化人脸检测...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-overlay">
      <p>错误: {{ error }}</p>
      <button @click="startDetection">重试</button>
    </div>

    <!-- 视频和画布 -->
    <div v-else class="video-container">
      <video
        ref="videoRef"
        class="input-video"
        autoplay
        muted
        playsinline
      ></video>
      <canvas ref="canvasRef" class="output-canvas"></canvas>

      <!-- 人脸检测成功遮罩 -->
      <div v-if="faceDetectionSuccess" class="success-overlay">
        <div class="success-content">
          <div class="success-icon">✓</div>
          <p class="success-text">人脸检测成功！</p>

          <!-- 拍照结果展示 -->
          <div v-if="capturedImage" class="captured-photo">
            <img :src="capturedImage" alt="拍照结果" class="captured-image" />
            <p class="photo-caption">拍照结果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-detection-container {
  position: relative;
  display: block;
  background: #f0f0f0;
}

.debug-info p {
  margin: 2px 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.input-video,
.output-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.input-video {
  z-index: 1;
}

.output-canvas {
  z-index: 2;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgb(0 0 0 / 80%);
}

.error-overlay button {
  padding: 8px 16px;
  margin-top: 10px;
  color: white;
  cursor: pointer;
  background: #007bff;
  border: none;
  border-radius: 4px;
}

.error-overlay button:hover {
  background: #0056b3;
}

.success-overlay {
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 60%);
  backdrop-filter: blur(4px);
  animation: fade-in-success 0.3s ease-in-out;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 80vh;
  padding: 24px;
  overflow-y: auto;
  color: white;
  text-align: center;
  background: rgb(34 197 94 / 90%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 20%);
}

.success-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  font-size: 40px;
  font-weight: bold;
  line-height: 60px;
  color: white;
  background: rgb(22 163 74);
  border-radius: 50%;
  animation: scale-in 0.5s ease-out;
}

.success-text {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.success-subtext {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.captured-photo {
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
}

.captured-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border: 3px solid white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
}

.photo-caption {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.95;
}

@keyframes fade-in-success {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
