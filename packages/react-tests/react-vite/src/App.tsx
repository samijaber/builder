import { getAPIKey, getProps } from '@builder.io/sdks-e2e-tests';
import { BuilderComponent, builder, Builder } from '@builder.io/react';
import { useEffect } from 'react';
import { getCustomComponents } from '@builder.io/sdks-tests-custom-components/output/react/src/index';

builder.init(getAPIKey());
// default to not tracking, and re-enable when appropriate
builder.canTrack = false;

function App() {
  const props = { ...getProps(), customComponents: getCustomComponents() };

  props.customComponents.forEach(({ component, ...info }) => {
    Builder.registerComponent(component, info);
  });

  if (props?.apiVersion) {
    builder.apiVersion = props?.apiVersion;
  }

  // only enable tracking if we're not in the `/can-track-false` test route
  useEffect(() => {
    if (!window.location.pathname.includes('can-track-false')) {
      builder.canTrack = true;
    }
  }, []);

  // issues with react types incompatibility (v16 vs v17 vs v18?)
  // @ts-ignore
  return props ? <BuilderComponent {...props} /> : <div>Content Not Found</div>;
}

export default App;
