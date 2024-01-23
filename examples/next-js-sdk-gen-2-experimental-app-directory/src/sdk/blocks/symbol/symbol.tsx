import ContentVariants from '../../components/content-variants/content-variants';
import type { BuilderContent } from '../../types/builder-content';
import type { PropsWithBuilderData } from '../../types/builder-props';
import type { Nullable } from '../../types/typescript';
import { fetchSymbolContent } from './symbol.helpers';
import type { SymbolProps } from './symbol.types';

async function Symbol(props: PropsWithBuilderData<SymbolProps>) {
  const className = function className() {
    return [
      ...[props.attributes.className],
      'builder-symbol',
      props.symbol?.inline ? 'builder-inline-symbol' : undefined,
      props.symbol?.dynamic || props.dynamic ? 'builder-dynamic-symbol' : undefined,
    ]
      .filter(Boolean)
      .join(' ');
  };
  const contentToUse = (props.symbol?.content ||
    (await fetchSymbolContent({
      symbol: props.symbol,
      builderContextValue: props.builderContext,
    }))) as Nullable<BuilderContent>;
  const setContent = null;

  return (
    <div {...{}} {...props.attributes} {...{}} className={className()}>
      <ContentVariants
        __isNestedRender={true}
        apiVersion={props.builderContext.apiVersion}
        apiKey={props.builderContext.apiKey!}
        context={props.builderContext.context}
        customComponents={Object.values(props.builderComponents)}
        data={{
          ...props.symbol?.data,
          ...props.builderContext.localState,
          ...contentToUse?.data?.state,
        }}
        model={props.symbol?.model}
        content={contentToUse}
      />
    </div>
  );
}

export default Symbol;
