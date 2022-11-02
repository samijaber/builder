import { types } from '@babel/core';
import * as babel from '@babel/core';

const replacePropsIdentifier = (code, newIdentifier) =>
  babel.transform(code, {
    plugins: [
      [
        () => ({
          visitor: {
            MemberExpression(path) {
              // replace all instances of `props` with `newIdentifier`
            },
          },
        }),
      ],
    ],
  });

replacePropsIdentifier('props.customComponents'); // --> 'customComponents'
replacePropsIdentifier('props.customComponents', 'this'); // --> 'this.customComponents'

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
    ${replacePropsIdentifier(ON_MOUNT_CODE)} 
});`;

const SOLIDJS_CODE = `
  onMount(() => { 
    ${ON_MOUNT_CODE} 
});`;

const QWIK_CODE = `
  useClientEffect$(() => { 
    ${ON_MOUNT_CODE} 
});`;
