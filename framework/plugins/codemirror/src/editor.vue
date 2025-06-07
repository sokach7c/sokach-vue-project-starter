<script setup lang="ts">
import type { CodeMirrorOptions, LanguageType } from './helper';

import { computed, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { oneDark } from '@codemirror/theme-one-dark';

import { defaultOptions, languageExtensions } from './helper';

interface Props {
  disabled?: boolean;
  height?: number | string;
  language?: LanguageType;
  options?: Partial<CodeMirrorOptions>;
  placeholder?: string;
  readOnly?: boolean;
  width?: number | string;
}

defineOptions({
  name: 'CodeMirrorEditor',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  height: '200px',
  language: 'javascript',
  options: () => ({}),
  placeholder: '请输入代码...',
  readOnly: false,
  width: '100%',
});

const emit = defineEmits<{
  blur: [];
  change: [value: string];
  focus: [];
  ready: [];
}>();

const content = defineModel<string>('modelValue', {
  default: '',
});

// 计算语言扩展
const languageExtension = computed(() => {
  return languageExtensions[props.language] || languageExtensions.javascript;
});

// 计算完整配置
const editorOptions = computed(() => {
  const mergedOptions = {
    ...defaultOptions,
    ...props.options,
    language: props.language,
    readOnly: props.readOnly || props.disabled,
    placeholder: props.placeholder,
    height: props.height,
    width: props.width,
  };

  return mergedOptions;
});

// 计算扩展配置
const extensions = computed(() => {
  const exts = [languageExtension.value, oneDark];

  if (editorOptions.value.extensions) {
    exts.push(...editorOptions.value.extensions);
  }

  return exts;
});

// 监听内容变化
watch(content, (newValue) => {
  emit('change', newValue);
});

// 事件处理
const handleReady = () => {
  emit('ready');
};

const handleFocus = () => {
  emit('focus');
};

const handleBlur = () => {
  emit('blur');
};

// 样式计算
const editorStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

// 暴露方法
const getContent = () => content.value;
const setContent = (value: string) => {
  content.value = value;
};
const focus = () => {
  // 可以在这里添加聚焦逻辑
};

defineExpose({
  getContent,
  setContent,
  focus,
});
</script>

<template>
  <div class="codemirror-editor" :style="editorStyle">
    <Codemirror
      v-model="content"
      :placeholder="editorOptions.placeholder"
      :style="editorStyle"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :disabled="editorOptions.readOnly"
      @ready="handleReady"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<style scoped>
.codemirror-editor {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

:deep(.cm-editor) {
  outline: none;
}

:deep(.cm-content) {
  min-height: 60px;
  padding: 12px;
}

:deep(.cm-focused) {
  outline: none;
}

:deep(.cm-scroller) {
  font-family:
    'JetBrains Mono', 'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
