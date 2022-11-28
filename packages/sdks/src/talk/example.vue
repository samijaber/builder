<template>
  <div class="div" @click="trackClick(content.id)">
    <render-blocks :blocks="content.blocks"></render-blocks>
  </div>
</template>

<script setup>
import { onMounted, provide, watch } from 'vue';

const props = defineProps(['content', 'customComponents']);

provide(BuilderContext, {
  content: props.content,
  registeredComponents: props.customComponents,
});

onMounted(() => {
  sendComponentsToVisualEditor(registeredComponent);
});

watch(
  () => [props.content],
  ([content]) => {
    dispatchNewContentToVisualEditor(props.content);
  }
);
</script>

<style scoped>
.div {
  display: flex;
  flex-direction: columns;
}
</style>
