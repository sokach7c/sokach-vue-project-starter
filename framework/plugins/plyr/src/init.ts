import type { Options } from 'plyr';

let defaultOptions: Partial<Options> = {
  // 控制栏配置
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'fullscreen',
  ],

  // 设置菜单配置
  settings: ['captions', 'pip', 'speed', 'quality'],

  // 播放速度选项
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  },

  // 质量选项
  quality: {
    default: 720,
    options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
    forced: true,
  },

  // 音量配置
  volume: 0.5,
  muted: false,

  // 播放配置
  autoplay: false,
  loop: { active: false },

  // 界面配置
  hideControls: true,
  resetOnEnd: false,
  disableContextMenu: true,

  // 键盘快捷键
  keyboard: {
    focused: true,
    global: false,
  },

  // 工具提示
  tooltips: {
    controls: true,
    seek: true,
  },

  // 字幕配置
  captions: {
    active: false,
    language: 'auto',
    update: false,
  },

  // 全屏配置
  fullscreen: {
    enabled: true,
    fallback: true,
    iosNative: false,
  },

  // 预览缩略图
  previewThumbnails: {
    enabled: false,
  },

  // 广告配置
  ads: {
    enabled: false,
  },

  // 国际化
  i18n: {
    restart: '重新播放',
    rewind: '快退 {seektime}s',
    play: '播放',
    pause: '暂停',
    pip: '画中画',
    fastForward: '快进 {seektime}s',
    seek: '跳转',
    seekLabel: '{currentTime} / {duration}',
    played: '已播放',
    buffered: '已缓冲',
    currentTime: '当前时间',
    duration: '总时长',
    volume: '音量',
    mute: '静音',
    unmute: '取消静音',
    enableCaptions: '启用字幕',
    disableCaptions: '禁用字幕',
    download: '下载',
    enterFullscreen: '进入全屏',
    exitFullscreen: '退出全屏',
    frameTitle: '{title} 播放器',
    captions: '字幕',
    settings: '设置',
    menuBack: '返回上级菜单',
    speed: '播放速度',
    normal: '正常',
    quality: '画质',
    loop: '循环播放',
    start: '开始',
    end: '结束',
    all: '全部',
    reset: '重置',
    disabled: '禁用',
    enabled: '启用',
    advertisement: '广告',
    qualityBadge: {
      2160: '4K',
      1440: 'HD',
      1080: 'HD',
      720: 'HD',
      576: 'SD',
      480: 'SD',
    },
  },
};

export function setupPlyr(options: Partial<Options>) {
  defaultOptions = { ...defaultOptions, ...options };
}

export function mergePlyrOptions(options: Partial<Options> = {}) {
  return { ...defaultOptions, ...options };
}
