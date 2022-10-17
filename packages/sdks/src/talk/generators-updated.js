const ON_MOUNT_CODE = `
  Object.values(props.customComponents).forEach((registeredComponent) => {
    sendComponentToVisualEditor(registeredComponent);
  });
`;

import { types } from '@babel/core';
import * as babel from '@babel/core';
const babelTransformer = (newIdentifier) => {
  return {
    MemberExpression(path) {
      if (
        types.isIdentifier(path.node.object) &&
        path.node.object.name === 'props'
      ) {
        const newNode = newIdentifier
          ? types.memberExpression(
              types.identifier(newIdentifier),
              path.node.property
            )
          : path.node.property;
        path.replaceWith(newNode);
      }
    },
  };
};

const replacePropsIdentifier = (code, newIdentifier) => {
  babel.transform(code, {
    plugins: [[() => ({ visitor: babelTransformer(newIdentifier) })]],
  });
};

const REACT_CODE = `
useEffect(() => {
  ${ON_MOUNT_CODE}
}, []);`;

const VUE_CODE = `
mounted() {
  ${replacePropsIdentifier(ON_MOUNT_CODE, 'this')}
}`;

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
