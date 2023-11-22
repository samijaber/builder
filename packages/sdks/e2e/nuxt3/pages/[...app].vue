<script setup>
import { RenderContent, _processContentResult } from '@builder.io/sdk-vue';
import {
  RenderContent as EdgeContent,
  _processContentResult as _edgeProcessContentResult,
} from '@builder.io/sdk-vue/vue3/edge';
import '@builder.io/sdk-vue/css';
import { getProps, getRuntime } from '@e2e/tests';

const route = useRoute();

const runtime = getRuntime(route.query);

const { data: props } = await useAsyncData('builderData', () =>
  getProps({
    pathname: route.path,
    _processContentResult:
      runtime === 'edge' ? _edgeProcessContentResult : _processContentResult,
  })
);
</script>

<template>
  <div v-if="props?.content">
    <EdgeContent v-if="runtime === 'edge'" v-bind="props" />
    <RenderContent v-else v-bind="props" />
  </div>
  <div v-else>Content not Found</div>
</template>
