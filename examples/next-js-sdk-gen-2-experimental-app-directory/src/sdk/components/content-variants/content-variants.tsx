import { TARGET } from '../../constants/target';
import { handleABTestingSync } from '../../helpers/ab-tests';
import { getDefaultCanTrack } from '../../helpers/canTrack';
import ContentComponent from '../content/content';
import InlinedScript from '../inlined-script';
import InlinedStyles from '../inlined-styles';
import type { ContentVariantsPrps } from './content-variants.types';
import {
  checkShouldRenderVariants,
  getScriptString,
  getUpdateCookieAndStylesScript,
  getVariants,
} from './helpers';

type VariantsProviderProps = ContentVariantsPrps & {
  /**
   * For internal use only. Do not provide this prop.
   */
  __isNestedRender?: boolean;
};

function ContentVariants(props: VariantsProviderProps) {
  const shouldRenderVariants = checkShouldRenderVariants({
    canTrack: getDefaultCanTrack(props.canTrack),
    content: props.content,
  });
  const updateCookieAndStylesScriptStr = function updateCookieAndStylesScriptStr() {
    return getUpdateCookieAndStylesScript(
      getVariants(props.content).map(value => ({
        id: value.testVariationId!,
        testRatio: value.testRatio,
      })),
      props.content?.id || ''
    );
  };
  const hideVariantsStyleString = function hideVariantsStyleString() {
    return getVariants(props.content)
      .map(value => `.variant-${value.testVariationId} { display: none; } `)
      .join('');
  };
  const defaultContent = function defaultContent() {
    return shouldRenderVariants
      ? {
          ...props.content,
          testVariationId: props.content?.id,
        }
      : handleABTestingSync({
          item: props.content,
          canTrack: getDefaultCanTrack(props.canTrack),
        });
  };

  return (
    <>
      {!props.__isNestedRender && TARGET !== 'reactNative' ? (
        <>
          <InlinedScript scriptStr={getScriptString()} />
        </>
      ) : null}

      {shouldRenderVariants ? (
        <>
          <InlinedStyles
            id={`variants-styles-${props.content?.id}`}
            styles={hideVariantsStyleString()}
          />
          <InlinedScript scriptStr={updateCookieAndStylesScriptStr()} />
          {getVariants(props.content)?.map(variant => (
            <ContentComponent
              key={variant.testVariationId}
              content={variant}
              showContent={false}
              model={props.model}
              data={props.data}
              context={props.context}
              apiKey={props.apiKey}
              apiVersion={props.apiVersion}
              customComponents={props.customComponents}
              canTrack={props.canTrack}
              locale={props.locale}
              includeRefs={props.includeRefs}
              enrich={props.enrich}
              isSsrAbTest={shouldRenderVariants}
              blocksWrapper={props.blocksWrapper}
              blocksWrapperProps={props.blocksWrapperProps}
              contentWrapper={props.contentWrapper}
              contentWrapperProps={props.contentWrapperProps}
            />
          ))}
        </>
      ) : null}

      <ContentComponent
        {...{}}
        content={defaultContent()}
        showContent={true}
        model={props.model}
        data={props.data}
        context={props.context}
        apiKey={props.apiKey}
        apiVersion={props.apiVersion}
        customComponents={props.customComponents}
        canTrack={props.canTrack}
        locale={props.locale}
        includeRefs={props.includeRefs}
        enrich={props.enrich}
        isSsrAbTest={shouldRenderVariants}
        blocksWrapper={props.blocksWrapper}
        blocksWrapperProps={props.blocksWrapperProps}
        contentWrapper={props.contentWrapper}
        contentWrapperProps={props.contentWrapperProps}
      />
    </>
  );
}

export default ContentVariants;
