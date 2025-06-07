import type { Options } from 'plyr';

import { ref } from 'vue';

import { mergePlyrOptions, setupPlyr } from './init';
import PlyrVideo from './plyr-video.vue';

// 简化的 Hook 接口
interface UsePlyrReturn {
  createOptions: (options: Partial<Options>) => Partial<Options>;
  PlyrVideo: typeof PlyrVideo;
  setupGlobal: (options: Partial<Options>) => void;
}

/**
 * 简化的 Plyr Hook
 * @param defaultOptions 默认配置选项
 * @returns PlyrVideo 组件和工具函数
 */
export function usePlyr(defaultOptions: Partial<Options> = {}): UsePlyrReturn {
  // 创建配置选项的工具函数
  const createOptions = (options: Partial<Options> = {}) => {
    return mergePlyrOptions({ ...defaultOptions, ...options });
  };

  // 设置全局配置的工具函数
  const setupGlobal = (options: Partial<Options>) => {
    setupPlyr(options);
  };

  return {
    PlyrVideo,
    createOptions,
    setupGlobal,
  };
}

/**
 * 创建播放器实例引用
 * 用于在组件外部控制播放器
 */
export function createPlyrRef() {
  return ref<InstanceType<typeof PlyrVideo>>();
}

// 导出组件
export { PlyrVideo };
