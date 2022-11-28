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

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

//qwik: ✅
useClientEffect$(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

//react: ✅
useEffect(() => {
  sendComponentsToVisualEditor(props.customComponents);
}, []);

//solidjs: ✅
onMount(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

//svelte: ❌ (there is no props is not defined)
onMount(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

//vue: ✅
onMounted(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

// before
//svelte: ❌ (there is no props is not defined)
onMount(() => {
  sendComponentsToVisualEditor(props.customComponents);
});

// after
//svelte: ✅
onMount(() => {
  sendComponentsToVisualEditor(customComponents);
});
