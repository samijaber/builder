import { setContext } from '@builder.io/mitosis';
import BuilderContext from '../../context/builder.context.lite';
import StateContext from '../../context/state.context.lite';
import type {
  BuilderContextInterface,
  BuilderStateContext,
} from '../../context/types.js';
import type { BuilderBlock } from '../../types/builder-block';
import RenderBlock from './render-block.lite';

type Props = {
  block: BuilderBlock;
  repeatContext: BuilderContextInterface;
  repeatState: BuilderStateContext;
};

/**
 * We can't make this a generic `ProvideContext` function because Vue 2 won't support root slots, e.g.
 *
 * ```vue
 * <template>
 *  <slot></slot>
 * </template>
 * ```
 */
export default function RenderRepeatedBlock(props: Props) {
  setContext(BuilderContext, {
    get content() {
      return props.repeatContext.content;
    },
    get context() {
      return props.repeatContext.context;
    },
    get apiKey() {
      return props.repeatContext.apiKey;
    },
    get registeredComponents() {
      return props.repeatContext.registeredComponents;
    },
    get inheritedStyles() {
      return props.repeatContext.inheritedStyles;
    },
  });

  setContext(StateContext, props.repeatState);

  return (
    <RenderBlock
      block={props.block}
      context={props.repeatContext}
      contextState={props.repeatState}
    />
  );
}
