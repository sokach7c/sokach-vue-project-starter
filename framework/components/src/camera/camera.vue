<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  autostart?: boolean;
  facingMode?: 'environment' | 'user';
  height?: number;
  imageFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  imageQuality?: number;
  width?: number;
}

interface CameraEmits {
  error: [error: Error];
  photo: [imageData: string];
  ready: [];
  stop: [];
}

defineOptions({
  name: 'Camera',
});

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 480,
  facingMode: 'user',
  autostart: true,
  imageFormat: 'image/jpeg',
  imageQuality: 0.8,
});

const emit = defineEmits<CameraEmits>();

// Expose methods for external use
defineExpose({
  startCamera,
  stopCamera,
  takePhoto,
  isActive: () => isActive.value,
});

const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();
const stream = ref<MediaStream>();
const isActive = ref(false);
const error = ref<string>();

async function startCamera() {
  try {
    error.value = undefined;

    const constraints: MediaStreamConstraints = {
      video: {
        width: props.width,
        height: props.height,
        facingMode: props.facingMode,
      },
    };

    stream.value = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      await videoRef.value.play();
      isActive.value = true;
      emit('ready');
    }
  } catch (error_) {
    const errorMsg =
      error_ instanceof Error ? error_ : new Error('Camera access denied');
    error.value = errorMsg.message;
    emit('error', errorMsg);
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = undefined;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }

  isActive.value = false;
  emit('stop');
}

function takePhoto(): null | string {
  if (!videoRef.value || !canvasRef.value || !isActive.value) {
    return null;
  }

  const canvas = canvasRef.value;
  const video = videoRef.value;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL(props.imageFormat, props.imageQuality);
  emit('photo', imageData);

  return imageData;
}

onMounted(() => {
  if (props.autostart) {
    startCamera();
  }
});

onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <div class="camera">
    <video
      ref="videoRef"
      :width="width"
      :height="height"
      autoplay
      playsinline
      muted
    ></video>

    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      style="display: none"
    ></canvas>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.camera {
  display: inline-block;
}

.camera video {
  display: block;
  background: #000;
}

.error {
  margin-top: 8px;
  font-size: 14px;
  color: #dc2626;
}
</style>
