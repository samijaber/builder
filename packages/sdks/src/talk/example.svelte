<script>
  import { onMount, setContext } from 'svelte';

  export let content;
  export let customComponents;

  setContext('BuilderContext', {
    content: props.content,
    registeredComponents: props.customComponents,
  });

  onMount(() => {
    sendComponentsToVisualEditor(customComponents);
  });

  $: dispatchNewContentToVisualEditor(content);
</script>

<div
  class="div"
  on:click={(event) => {
    trackClick(content.id);
  }}
>
  <RenderBlocks blocks={content.blocks} />
</div>

<style>
  .div {
    display: flex;
    flex-direction: columns;
  }
</style>
