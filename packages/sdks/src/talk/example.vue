<script setup>
import { onMounted, provide, watch } from 'vue';

const props = defineProps(['content', 'customComponents']);

provide(BuilderContext, undefined);

onMounted(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

watch([props.content], ([content]) => {
  dispatchNewContentToVisualEditor(props.content);
});
</script>

<template>
  <div class="div" @click="trackClick(content.id)">
    <render-blocks :blocks="content.blocks"></render-blocks>
  </div>
</template>

<style scoped>
.div {
  display: flex;
  flex-direction: columns;
}
</style>
