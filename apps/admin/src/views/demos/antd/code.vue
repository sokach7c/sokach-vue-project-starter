<script setup lang="ts">
import { ref } from 'vue';

import { CodeMirrorEditor } from '@sokach-plugin/codemirror';

const code = ref(`function hello() {
  console.log('Hello, CodeMirror!');
}`);

const handleChange = (value: string) => {
  console.warn('代码变化:', value);
};
</script>

<template>
  <CodeMirrorEditor
    v-model="code"
    language="javascript"
    theme="light"
    height="300px"
    placeholder="请输入代码..."
    @change="handleChange"
  />
</template>
