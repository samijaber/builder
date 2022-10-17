<script>
  import { onMount, setContext } from 'svelte';

  export let content;
  export let customComponents;

  setContext(BuilderContext.key, {
    content: props.content,
    registeredComponents: props.customComponents,
  });

  onMount(() => {
    Object.values(customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
  });

  $: dispatchNewContentToVisualEditor(content);
</script>

<div
  on:click={(event) => {
    trackClick(content.id);
  }}
>
  <RenderBlocks blocks={content.blocks} />
</div>
