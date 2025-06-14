import type { AiEditorOptions } from 'aieditor';

const defaultOptions: Partial<AiEditorOptions> = {
  placeholder: '点击输入内容...',
  contentIsMarkdown: false,
  // 会持久化到本地，放置丢失
  contentRetention: false,
  fontSize: {
    values: [
      { name: '8px', value: 8 },
      { name: '10px', value: 10 },
      { name: '12px', value: 12 },
      { name: '14px', value: 14 },
      { name: '16px', value: 16 },
      { name: '18px', value: 18 },
      { name: '24px', value: 24 },
      { name: '36px', value: 36 },
    ],
  },
  contentRetentionKey: 'ai-editor-content',
  draggable: false,
  // textCounter: (text: string) => `${text.length}字`,
  ai: {
    models: {
      openai: {
        endpoint: 'https://api.siliconflow.cn',
        model: 'deepseek-ai/DeepSeek-R1',
        apiKey: 'sk-olrbfphjgdztthuerizpmghvkdelpbdevdsevxjmcuokryyb',
      },
    },
    bubblePanelEnable: false,
    // AI菜单，这里禁用掉
    commands: [],
  },
  // 浮动菜单
  textSelectionBubbleMenu: {
    enable: true,
    items: ['ai', 'Bold', 'Italic', 'Underline', 'Strike', 'code', 'comment'],
  },
  toolbarKeys: [
    'undo',
    'redo',
    'brush',
    'eraser',
    '|',
    'heading',
    'font-family',
    'font-size',
    '|',
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'code',
    'subscript',
    'superscript',
    'hr',
    'todo',
    'emoji',
    '|',
    'highlight',
    'font-color',
    '|',
    'align',
    'line-height',
    '|',
    'bullet-list',
    'ordered-list',
    'indent-decrease',
    'indent-increase',
    'break',
    '|',
    'image',
    'video',
    'attachment',
    'quote',
    'code-block',
    'table',
    '|',
    'source-code',
    'printer',
    'fullscreen',
    // 'ai',
  ],
};

export default defaultOptions;
