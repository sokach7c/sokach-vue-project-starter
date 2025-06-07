import { angular } from '@codemirror/lang-angular';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { go } from '@codemirror/lang-go';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { less } from '@codemirror/lang-less';
import { markdown } from '@codemirror/lang-markdown';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sass } from '@codemirror/lang-sass';
import { sql } from '@codemirror/lang-sql';
import { vue } from '@codemirror/lang-vue';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';

// 语言映射
export const languageExtensions = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
  json: json(),
  css: css(),
  html: html(),
  vue: vue(),
  python: python(),
  sql: sql(),
  xml: xml(),
  markdown: markdown(),
  php: php(),
  rust: rust(),
  cpp: cpp(),
  java: java(),
  yaml: yaml(),
  yml: yaml(),
  go: go(),
  less: less(),
  sass: sass(),
  scss: sass(),
  angular: angular(),
  text: [],
} as const;

export type LanguageType = keyof typeof languageExtensions;

// CodeMirror 配置选项接口
export interface CodeMirrorOptions {
  autocompletion?: boolean;
  bracketMatching?: boolean;
  closeBrackets?: boolean;
  extensions?: any[];
  foldGutter?: boolean;
  height?: number | string;
  language?: LanguageType;
  lineNumbers?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
  placeholder?: string;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
  width?: number | string;
}

// 默认配置
export const defaultOptions: CodeMirrorOptions = {
  language: 'javascript',
  theme: 'light',
  readOnly: false,
  lineNumbers: true,
  foldGutter: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  placeholder: '请输入代码...',
  height: '200px',
};
