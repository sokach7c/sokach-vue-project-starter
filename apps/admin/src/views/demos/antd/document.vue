<script setup lang="ts">
import { ref } from 'vue';

import { DocumentEditor } from '@sokach-plugin/aieditor';

const content = ref('');
</script>

<template>
  <DocumentEditor v-model="content" height="600px" />
</template>

<style scoped></style>
