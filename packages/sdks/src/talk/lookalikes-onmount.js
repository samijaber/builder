//react
useEffect(() => {
  sendComponentsToVisualEditor(props.customComponents);
}, []);

//vue
onMounted(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

//svelte
onMount(() => {
  sendComponentsToVisualEditor(customComponents);
});

//solidjs
onMount(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

//qwik
useClientEffect$(() => {
  sendComponentsToVisualEditor(props.customComponents);
});
