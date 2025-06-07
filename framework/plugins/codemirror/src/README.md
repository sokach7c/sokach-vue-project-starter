# CodeMirror 代码编辑器组件

基于 [vue-codemirror](https://github.com/surmon-china/vue-codemirror) 和 CodeMirror 6 的 Vue 3 代码编辑器组件封装。

## 特性

- 🚀 基于 CodeMirror 6，性能优异
- 🎨 支持多种编程语言高亮
- 🌙 支持明暗主题切换
- 📱 响应式设计，适配移动端
- 🔧 高度可定制化配置
- 💡 TypeScript 类型支持
- ⚡ Vue 3 Composition API

## 支持的语言

- JavaScript/TypeScript
- Vue、React JSX/TSX
- HTML、CSS、Less、Sass
- JSON、XML、YAML
- Python、Java、Go、Rust、C++
- PHP、SQL、Markdown
- Angular 模板

## 安装

确保项目中已安装相关依赖：

```bash
pnpm add vue-codemirror @codemirror/lang-javascript
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CodeMirrorEditor } from '@sokach-plugin/codemirror';

const code = ref(`function hello() {
  console.log('Hello, CodeMirror!');
}`);
</script>

<template>
  <CodeMirrorEditor
    v-model="code"
    language="javascript"
    theme="light"
    height="300px"
    placeholder="请输入代码..."
  />
</template>
```

## 多语言支持

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CodeMirrorEditor } from '@sokach-plugin/codemirror';

const jsCode = ref('console.log("Hello JavaScript");');
const vueCode = ref('<template><div>Hello Vue</div></template>');
const pythonCode = ref('print("Hello Python")');
</script>

<template>
  <div class="editors">
    <!-- JavaScript -->
    <CodeMirrorEditor v-model="jsCode" language="javascript" height="200px" />

    <!-- Vue -->
    <CodeMirrorEditor v-model="vueCode" language="vue" height="200px" />

    <!-- Python -->
    <CodeMirrorEditor v-model="pythonCode" language="python" height="200px" />
  </div>
</template>
```

## 主题切换

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CodeMirrorEditor } from '@sokach-plugin/codemirror';

const code = ref('const message = "Hello World";');
const theme = ref<'light' | 'dark'>('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <div>
    <button @click="toggleTheme">
      切换到 {{ theme === 'light' ? '暗色' : '亮色' }} 主题
    </button>

    <CodeMirrorEditor
      v-model="code"
      :theme="theme"
      language="javascript"
      height="250px"
    />
  </div>
</template>
```

## 只读模式

```vue
<template>
  <CodeMirrorEditor
    v-model="code"
    language="javascript"
    read-only
    height="200px"
  />
</template>
```

## 事件处理

```vue
<script setup lang="ts">
import { CodeMirrorEditor } from '@sokach-plugin/codemirror';

const handleChange = (value: string) => {
  console.log('代码内容变化:', value);
};

const handleFocus = () => {
  console.log('编辑器获得焦点');
};

const handleBlur = () => {
  console.log('编辑器失去焦点');
};

const handleReady = () => {
  console.log('编辑器初始化完成');
};
</script>

<template>
  <CodeMirrorEditor
    v-model="code"
    language="javascript"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @ready="handleReady"
  />
</template>
```

## API 文档

### Props

| 属性        | 类型                       | 默认值          | 说明           |
| ----------- | -------------------------- | --------------- | -------------- |
| modelValue  | string                     | ''              | 编辑器内容     |
| language    | LanguageType               | 'javascript'    | 编程语言       |
| theme       | 'light' \| 'dark'          | 'light'         | 编辑器主题     |
| height      | string \| number           | '200px'         | 编辑器高度     |
| width       | string \| number           | '100%'          | 编辑器宽度     |
| placeholder | string                     | '请输入代码...' | 占位符文本     |
| readOnly    | boolean                    | false           | 是否只读       |
| disabled    | boolean                    | false           | 是否禁用       |
| options     | Partial<CodeMirrorOptions> | {}              | 自定义配置选项 |

### Events

| 事件名 | 参数            | 说明             |
| ------ | --------------- | ---------------- |
| change | (value: string) | 内容变化时触发   |
| focus  | ()              | 获得焦点时触发   |
| blur   | ()              | 失去焦点时触发   |
| ready  | ()              | 初始化完成时触发 |

### Methods

| 方法名     | 参数            | 返回值 | 说明             |
| ---------- | --------------- | ------ | ---------------- |
| getContent | ()              | string | 获取编辑器内容   |
| setContent | (value: string) | void   | 设置编辑器内容   |
| focus      | ()              | void   | 使编辑器获得焦点 |

### 支持的语言类型

```typescript
type LanguageType =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'vue'
  | 'html'
  | 'css'
  | 'less'
  | 'sass'
  | 'scss'
  | 'json'
  | 'xml'
  | 'yaml'
  | 'yml'
  | 'python'
  | 'java'
  | 'go'
  | 'rust'
  | 'cpp'
  | 'php'
  | 'sql'
  | 'markdown'
  | 'angular'
  | 'text';
```

## 自定义配置

```vue
<script setup lang="ts">
import type { CodeMirrorOptions } from '@sokach-plugin/codemirror';

const customOptions: Partial<CodeMirrorOptions> = {
  lineNumbers: true,
  foldGutter: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
};
</script>

<template>
  <CodeMirrorEditor
    v-model="code"
    language="javascript"
    :options="customOptions"
  />
</template>
```

## 样式定制

组件支持通过 CSS 变量或深度选择器自定义样式：

```scss
.codemirror-editor {
  // 自定义边框
  border: 2px solid #3b82f6;
  border-radius: 8px;

  // 自定义字体
  :deep(.cm-scroller) {
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
  }

  // 自定义内边距
  :deep(.cm-content) {
    padding: 20px;
  }
}
```

## 注意事项

1. 确保项目中已正确安装 `vue-codemirror` 和相关语言包
2. 组件基于 Vue 3 Composition API，需要 Vue 3.0+
3. 大文件编辑时建议设置合适的高度避免性能问题
4. 主题切换时编辑器会自动应用新主题样式
