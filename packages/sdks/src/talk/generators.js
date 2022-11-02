const ON_MOUNT_CODE = `
  sendComponentsToVisualEditor(props.customComponents)
`;

const REACT_CODE = `
  useEffect(() => { 
    ${ON_MOUNT_CODE} 
}, []);`;

const VUE_CODE = `
  onMounted(() => { 
    ${ON_MOUNT_CODE} 
})`;

const SVELTE_CODE = `
  onMount(() => { 
    ${ON_MOUNT_CODE} 
});`;

const SOLIDJS_CODE = `
  onMount(() => { 
    ${ON_MOUNT_CODE} 
});`;

const QWIK_CODE = `
  useClientEffect$(() => { 
    ${ON_MOUNT_CODE} 
});`;
