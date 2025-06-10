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
  name: 'DocumentEditor',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  height: '100vh',
  options: () => defaultOptions,
  placeholder: '点击输入内容...',
  disabled: false,
});

const emit = defineEmits<{
  mounted: [];
}>();

const divRef = ref<HTMLDivElement>();
let aiEditor: AiEditor | null = null;

const content = defineModel<string>('modelValue', {
  default: '',
});
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

// 暴露编辑器实例方法
const getEditor = () => aiEditor;
const getContent = () => aiEditor?.getHtml() || '';
const setContent = (html: string) => aiEditor?.setContent(html);
const focus = () => aiEditor?.focus();
const blur = () => aiEditor?.blur();

defineExpose({
  getEditor,
  getContent,
  setContent,
  focus,
  blur,
});
</script>

<template>
  <div ref="divRef">
    <div class="aie-container">
      <div
        class="aie-header-panel"
        :style="{ backgroundColor: isDark ? 'rgb(26,27,30)' : '#fff' }"
      >
        <div class="aie-container-header"></div>
      </div>
      <div
        class="aie-main"
        :style="{
          backgroundColor: isDark ? 'rgb(26,27,30)' : 'rgb(242,243,246)',
          borderTop: isDark ? '1px solid rgb(45,45,48)' : '0',
        }"
      >
        <div class="aie-directory-content">
          <div class="aie-directory"></div>
        </div>
        <div
          class="aie-container-panel"
          :style="{ backgroundColor: isDark ? '#1E2022' : '#fff' }"
        >
          <div class="aie-container-main"></div>
        </div>
      </div>
      <div class="aie-container-footer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aie-header-panel {
  position: sticky;
  top: 51px;
  z-index: 1;
}

:deep(.aie-header-panel aie-header > div) {
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  border-bottom: 0;
}

:deep(.aie-container) {
  border: none !important;
}

:deep(.aie-container-panel) {
  z-index: 99;
  width: calc(100% - 2rem - 2px);
  max-width: 800px;
  height: 100%;
  min-height: 100vh;
  padding: 1rem;
  margin: 1rem auto;
  // background-color: #fff;
  // border: 1px solid rgb(229 231 235);
}

:deep(.aie-main) {
  position: relative;
}

.aie-directory {
  position: absolute;
  top: 30px;
  left: 10px;
  z-index: 0;
  width: 260px;
}

.aie-directory h5 {
  font-size: 16px;
  line-height: 32px;
  color: #000000c4;
  text-indent: 4px;
}

.aie-directory a {
  display: inline-block;
  width: 100%;
  height: 30px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 30px;
  color: #000000a3;
  text-indent: 4px;
  white-space: nowrap;
  text-decoration: none;
}

.aie-directory a:hover {
  cursor: pointer;
  background-color: #334d660f;
  border-radius: 4px;
}

.aie-title1 {
  font-size: 14px;
  font-weight: 500;
}

.aie-title2,
.aie-title3,
.aie-title4,
.aie-title5,
.aie-title6 {
  font-size: 12px;
}

.aie-directory-content {
  position: sticky;
  top: 108px;
}

@media screen and (max-width: 1280px) {
  .aie-directory {
    display: none;
  }
}

@media screen and (max-width: 1400px) {
  .aie-directory {
    width: 200px;
  }
}

:deep(.tippy-box) {
  background-color: transparent;
}
</style>
