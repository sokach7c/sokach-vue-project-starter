<script setup lang="ts">
import type { AiEditorOptions } from 'aieditor';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import { AiEditor } from 'aieditor';

import defaultOptions from './helper';

import 'aieditor/dist/style.css';

interface Props {
  disabled?: boolean;
  height?: number | string;
  options?: Partial<AiEditorOptions>;
  placeholder?: string;
}

defineOptions({
  name: 'AiEditor',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  options: () => defaultOptions,
  placeholder: '点击输入内容...',
  disabled: false,
});

const emit = defineEmits<{
  mounted: [];
}>();

const content = defineModel<string>('modelValue', {
  default: '',
});

const divRef = ref<HTMLDivElement>();
let aiEditor: AiEditor | null = null;

const { isDark, locale } = usePreferences();

/**
 * 通过重新创建编辑器实例来完成主题切换
 */
const init = ref(true);
watch([() => isDark.value, () => locale.value], async () => {
  if (!aiEditor) {
    return;
  }
  // 销毁当前编辑器实例
  aiEditor.destroy();
  aiEditor = null;
  init.value = false;

  // 在下一个 tick 重新创建
  await nextTick();
  init.value = true;
});

// 加载状态
const loading = ref(true);

const editorOptions = computed((): AiEditorOptions => {
  const { options, placeholder } = props;

  return {
    element: divRef.value!,
    placeholder,
    content: content.value,
    theme: isDark.value ? 'dark' : 'light',
    lang: locale.value === 'zh-CN' ? 'zh' : 'en',
    ...options,
    onChange: (aiEditor: AiEditor) => {
      const newContent = aiEditor.getHtml();
      if (newContent !== content.value) {
        content.value = newContent;
      }
    },
    onCreated: (editor: AiEditor) => {
      aiEditor = editor;
      emit('mounted');
      loading.value = false;
    },
  };
});

const createEditor = async () => {
  if (!divRef.value) return;

  try {
    aiEditor = new AiEditor(editorOptions.value);
  } catch (error) {
    console.error('Failed to create AiEditor:', error);
    loading.value = false;
  }
};

onMounted(() => {
  if (init.value) {
    createEditor();
  }
});

onUnmounted(() => {
  if (aiEditor) {
    aiEditor.destroy();
    aiEditor = null;
  }
});

// 监听 init 变化，重新创建编辑器
watch(init, (newVal) => {
  if (newVal) {
    nextTick(() => {
      createEditor();
    });
  }
});

// 监听内容变化，同步到编辑器
watch(content, (newContent) => {
  if (aiEditor && aiEditor.getHtml() !== newContent) {
    aiEditor.setContent(newContent);
  }
});

// 监听禁用状态
watch(
  () => props.disabled,
  (disabled) => {
    if (aiEditor) {
      if (disabled) {
        aiEditor.setEditable(false);
      } else {
        aiEditor.setEditable(true);
      }
    }
  },
);
</script>

<template>
  <div class="app-aieditor">
    <div
      v-if="init"
      ref="divRef"
      :style="{ height: typeof height === 'number' ? `${height}px` : height }"
      class="aieditor-container"
    ></div>
    <div v-if="loading" class="aieditor-loading">加载中...</div>
  </div>
</template>

<style lang="scss">
.app-aieditor {
  position: relative;

  .aieditor-container {
    width: 100%;
  }

  .aieditor-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 14px;
    color: #666;
    transform: translate(-50%, -50%);
  }

  .tippy-box {
    background-color: transparent;
  }
}
</style>
