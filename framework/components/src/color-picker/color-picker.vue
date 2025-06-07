<script setup lang="ts">
import type { ColorPickerProps } from 'vue3-colorpicker';

import { computed } from 'vue';

import { ColorPicker } from 'vue3-colorpicker';

import 'vue3-colorpicker/style.css';

interface Props {
  // 是否禁用
  disabled?: boolean;
  // 颜色格式
  format?: 'hex' | 'hsl' | 'hsv' | 'rgb';
  // 自定义配置
  options?: Partial<ColorPickerProps>;
  // 预设颜色
  presetColors?: string[];
  // 是否显示透明度
  showAlpha?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  presetColors: () => [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#ff1493',
    '#000000',
    '#ffffff',
  ],
  format: 'hex',
  disabled: false,
  showAlpha: false,
  options: () => ({}),
});

const emit = defineEmits<{
  change: [value: string];
  'update:value': [value: string];
}>();

// 使用 v-model:value
const value = defineModel<string>('value', {
  default: '#1890ff',
});

// 计算最终配置
const finalOptions = computed(() => {
  return {
    format: props.format as any,
    pureColor: value.value,
    shape: 'square',
    lang: 'ZH-cn' as any,
    predefineColors: props.presetColors,
    disableAlpha: !props.showAlpha,
    disabled: props.disabled,
    ...props.options,
  };
});

// 处理颜色变化
const handleChange = (event: any) => {
  if (event && event.color) {
    let newValue = '';

    switch (props.format) {
      case 'hex': {
        newValue = event.color.hex8 || event.color.hex || event.color;
        break;
      }
      case 'hsl': {
        newValue = event.color.hsla || event.color.hsl || event.color;
        break;
      }
      case 'hsv': {
        newValue = event.color.hsva || event.color.hsv || event.color;
        break;
      }
      case 'rgb': {
        newValue = event.color.rgba || event.color.rgb || event.color;
        break;
      }
      default: {
        newValue = event.color.hex || event.color;
      }
    }

    value.value = newValue;
    emit('change', newValue);
    emit('update:value', newValue);
  }
};
</script>

<template>
  <ColorPicker v-bind="finalOptions" @change="handleChange" />
</template>

<style scoped>
.vben-color-picker {
  display: inline-block;
}

/* 保持vue3-colorpicker原有样式，只做细微调整 */
:deep(.vc-color-picker) {
  /* 保持原样式 */
}

:deep(.vc-color-picker-trigger) {
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.vc-color-picker-trigger:hover) {
  transform: scale(1.05);
}

:deep(.vc-color-picker-trigger:focus) {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}
</style>
