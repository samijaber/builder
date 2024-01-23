import { getDefaultRegisteredComponents } from '../../constants/builder-registered-components';
import { TARGET } from '../../constants/target';
import type { BuilderRenderState, RegisteredComponents } from '../../context/types';
import { components, serializeComponentInfo } from '../../functions/register-component';
import type { ComponentInfo } from '../../types/components';
import type { Dictionary } from '../../types/typescript';
import Blocks from '../blocks/blocks';
import { getUpdateVariantVisibilityScript } from '../content-variants/helpers';
import InlinedScript from '../inlined-script';
import EnableEditor from './components/enable-editor';
import ContentStyles from './components/styles';
import { getContentInitialValue, getRootStateInitialValue } from './content.helpers';
import type { ContentProps } from './content.types';

function ContentComponent(props: ContentProps) {
  const scriptStr = getUpdateVariantVisibilityScript({
    variationId: props.content?.testVariationId!,
    contentId: props.content?.id!,
  });
  const contentSetState = function contentSetState(newRootState: BuilderRenderState) {
    builderContextSignal.rootState = newRootState;
  };
  const registeredComponents = [
    ...getDefaultRegisteredComponents(),
    // While this `components` object is deprecated, we must maintain support for it.
    // Since users are able to override our default components, we need to make sure that we do not break such
    // existing usage.
    // This is why we spread `components` after the default Builder.io components, but before the `props.customComponents`,
    // which is the new standard way of providing custom components, and must therefore take precedence.
    ...components,
    ...(props.customComponents || []),
  ].reduce<RegisteredComponents>(
    (acc, { component, ...info }) => ({
      ...acc,
      [info.name]: {
        component: component,
        ...serializeComponentInfo(info),
      },
    }),
    {}
  );
  const builderContextSignal = {
    content: getContentInitialValue({
      content: props.content,
      data: props.data,
    }),
    localState: undefined,
    rootState: getRootStateInitialValue({
      content: props.content,
      data: props.data,
      locale: props.locale,
    }),
    rootSetState: undefined,
    context: props.context || {},
    apiKey: props.apiKey,
    apiVersion: props.apiVersion,
    componentInfos: [
      ...getDefaultRegisteredComponents(),
      // While this `components` object is deprecated, we must maintain support for it.
      // Since users are able to override our default components, we need to make sure that we do not break such
      // existing usage.
      // This is why we spread `components` after the default Builder.io components, but before the `props.customComponents`,
      // which is the new standard way of providing custom components, and must therefore take precedence.
      ...components,
      ...(props.customComponents || []),
    ].reduce<Dictionary<ComponentInfo>>(
      (acc, { component: _, ...info }) => ({
        ...acc,
        [info.name]: serializeComponentInfo(info),
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: props.blocksWrapper || 'div',
    BlocksWrapperProps: props.blocksWrapperProps || {},
  };

  return (
    <EnableEditor
      content={props.content}
      data={props.data}
      model={props.model}
      context={props.context}
      apiKey={props.apiKey}
      canTrack={props.canTrack}
      locale={props.locale}
      includeRefs={props.includeRefs}
      enrich={props.enrich}
      showContent={props.showContent}
      builderContextSignal={builderContextSignal}
      contentWrapper={props.contentWrapper}
      contentWrapperProps={props.contentWrapperProps}
      {...{}}
    >
      {props.isSsrAbTest ? (
        <>
          <InlinedScript scriptStr={scriptStr} />
        </>
      ) : null}

      {TARGET !== 'reactNative' ? (
        <>
          <ContentStyles
            contentId={builderContextSignal.content?.id}
            cssCode={builderContextSignal.content?.data?.cssCode}
            customFonts={builderContextSignal.content?.data?.customFonts}
          />
        </>
      ) : null}

      <Blocks
        blocks={builderContextSignal.content?.data?.blocks}
        context={builderContextSignal}
        registeredComponents={registeredComponents}
      />
    </EnableEditor>
  );
}

export default ContentComponent;
