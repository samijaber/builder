import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { RenderContent } from '@builder.io/sdk-qwik';
import { getProps } from '@builder.io/sdks-e2e-tests';
import { getCustomComponents } from '@builder.io/sdks-tests-custom-components/output/qwik/src/index';

export interface MainProps {
  url: string;
}
export default component$(() => {
  const { pathname } = useLocation();
  const contentProps = getProps(pathname);

  return contentProps ? (
    <RenderContent
      {...contentProps}
      customComponents={getCustomComponents(pathname)}
    />
  ) : (
    <div>Content Not Found</div>
  );
});
