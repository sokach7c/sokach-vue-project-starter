import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        meta: {
          title: 'DocumentEditor',
        },
        name: 'DocumentEditor',
        path: '/demos/document-editor',
        component: () => import('#/views/demos/antd/document.vue'),
      },
      {
        meta: {
          title: 'Map',
        },
        name: 'Map',
        path: '/demos/map',
        component: () => import('#/views/demos/antd/map.vue'),
      },
      {
        meta: {
          title: 'Chart',
        },
        name: 'Chart',
        path: '/demos/chart',
        component: () => import('#/views/demos/antd/chart.vue'),
      },
      {
        meta: {
          title: 'AI',
        },
        name: 'AI',
        path: '/demos/ai',
        component: () => import('#/views/demos/antd/ai.vue'),
      },
      {
        meta: {
          title: '视频',
        },
        name: 'Video',
        path: '/demos/video',
        component: () => import('#/views/demos/antd/video-simple.vue'),
      },
      {
        meta: {
          title: 'Face',
        },
        name: 'Face',
        path: '/demos/face',
        component: () => import('#/views/demos/antd/face.vue'),
      },
      {
        meta: {
          title: 'CodeMirror',
        },
        name: 'CodeMirror',
        path: '/demos/code-mirror',
        component: () => import('#/views/demos/antd/code.vue'),
      },
      {
        meta: {
          title: 'Page',
        },
        name: 'Page',
        path: '/demos/page',
        component: () => import('#/views/demos/antd/page.vue'),
      },
      {
        meta: {
          title: 'Form',
        },
        name: 'Form',
        path: '/demos/form',
        component: () => import('#/views/demos/antd/form.vue'),
      },
      {
        meta: {
          title: 'Image',
        },
        name: 'Image',
        path: '/demos/image',
        component: () => import('#/views/demos/antd/image.vue'),
      },
    ],
  },
];

export default routes;
