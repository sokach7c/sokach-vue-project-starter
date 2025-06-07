<script setup lang="ts">
import type { Options, SourceInfo } from 'plyr';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  watch,
} from 'vue';

import Plyr from 'plyr';

import { mergePlyrOptions } from './init';

interface Props {
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  options?: Partial<Options>;
  poster?: string;
  sources?: SourceInfo[];
  src?: string;
  type?: 'audio' | 'video';
  volume?: number;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  poster: '',
  type: 'video',
  sources: () => [],
  options: () => ({}),
  autoplay: false,
  muted: false,
  volume: 0.5,
  loop: false,
  controls: true,
});

const emit = defineEmits<{
  ended: [];
  error: [error: any];
  loadstart: [];
  pause: [];
  play: [];
  ratechange: [];
  ready: [player: Plyr];
  seeked: [];
  seeking: [];
  timeupdate: [];
  volumechange: [];
}>();

// 播放器元素引用
const playerEl = ref<HTMLElement>();
// 播放器实例
const player = ref<Plyr>();

// 合并配置选项
const playerOptions = computed(() =>
  mergePlyrOptions({
    autoplay: props.autoplay,
    muted: props.muted,
    volume: props.volume,
    loop: { active: props.loop },
    ...props.options,
  }),
);

// 计算播放源
const plyrSource = computed(() => {
  // 优先使用 sources
  if (props.sources && props.sources.length > 0) {
    return {
      type: props.type,
      sources: props.sources,
      poster: props.poster,
    };
  }

  // 使用单个 src
  if (!props.src) {
    return null;
  }

  const fileExtension = props.src.split('.').pop()?.toLowerCase() || '';
  let mediaType = props.type;

  // 根据文件扩展名自动判断类型
  if (['aac', 'flac', 'mp3', 'ogg', 'wav'].includes(fileExtension)) {
    mediaType = 'audio';
  }

  return {
    type: mediaType,
    sources: [
      {
        src: props.src,
        type: `${mediaType}/${fileExtension}`,
      },
    ],
    poster: props.poster,
  };
});

// 初始化播放器
function initPlayer() {
  if (!playerEl.value) return;

  player.value = new Plyr(playerEl.value, playerOptions.value);

  // 设置初始源
  if (plyrSource.value) {
    player.value.source = plyrSource.value as any;
  }

  // 绑定事件
  bindEvents();
}

// 绑定播放器事件
function bindEvents() {
  if (!player.value) return;

  player.value.on('ready', () => emit('ready', player.value!));
  player.value.on('play', () => emit('play'));
  player.value.on('pause', () => emit('pause'));
  player.value.on('ended', () => emit('ended'));
  player.value.on('error', (event) => emit('error', event));
  player.value.on('timeupdate', () => emit('timeupdate'));
  player.value.on('loadstart', () => emit('loadstart'));
  player.value.on('volumechange', () => emit('volumechange'));
  player.value.on('seeking', () => emit('seeking'));
  player.value.on('seeked', () => emit('seeked'));
  player.value.on('ratechange', () => emit('ratechange'));
}

// 更新播放源
function updateSource() {
  if (!player.value) return;

  if (plyrSource.value) {
    player.value.source = plyrSource.value as any;
  } else {
    player.value.stop();
    player.value.source = {
      type: props.type,
      sources: [],
    } as any;
  }
}

// 监听源变化
watch(() => props.src, updateSource);
watch(() => props.sources, updateSource, { deep: true });

// 生命周期
onMounted(() => {
  initPlayer();
});

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy();
    player.value = undefined;
  }
});

// 暴露播放器实例和控制方法
defineExpose({
  player: readonly(player),
  play: () => player.value?.play(),
  pause: () => player.value?.pause(),
  stop: () => player.value?.stop(),
  restart: () => player.value?.restart(),
  togglePlay: () => player.value?.togglePlay(),
  setMuted: (muted: boolean) => {
    if (player.value) {
      player.value.muted = muted;
    }
  },
  toggleMuted: () => {
    if (player.value) {
      player.value.muted = !player.value.muted;
    }
  },
  setVolume: (volume: number) => {
    if (player.value) {
      player.value.volume = volume;
    }
  },
  increaseVolume: (step = 0.1) => player.value?.increaseVolume(step),
  decreaseVolume: (step = 0.1) => player.value?.decreaseVolume(step),
  forward: (seekTime = 10) => player.value?.forward(seekTime),
  rewind: (seekTime = 10) => player.value?.rewind(seekTime),
  enterFullscreen: () => player.value?.fullscreen.enter(),
  exitFullscreen: () => player.value?.fullscreen.exit(),
  toggleFullscreen: () => player.value?.fullscreen.toggle(),
});
</script>

<template>
  <div class="plyr-container">
    <component
      :is="type"
      ref="playerEl"
      class="plyr"
      playsinline
      :controls="controls"
      :data-poster="poster"
      crossorigin="anonymous"
      preload="metadata"
    />
  </div>
</template>

<style scoped>
.plyr-container {
  position: relative;
  width: 100%;
}
</style>
