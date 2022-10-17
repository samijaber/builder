<template>
  <div @click="trackClick(content.id)">
    <render-blocks :blocks="content.blocks"></render-blocks>
  </div>
</template>

<script>
export default {
  name: 'render-content',
  components: { RenderBlocks: RenderBlocks },
  props: ['content', 'customComponents'],

  provide() {
    return {
      BuilderContext: {
        content: this.content,
        registeredComponents: this.registeredComponents,
      },
    };
  },

  mounted() {
    Object.values(this.customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
  },

  watch: {
    onUpdateHook() {
      dispatchNewContentToVisualEditor(this.content);
    },
  },

  computed: {
    onUpdateHook() {
      return {
        0: this.content,
      };
    },
  },
};
</script>
