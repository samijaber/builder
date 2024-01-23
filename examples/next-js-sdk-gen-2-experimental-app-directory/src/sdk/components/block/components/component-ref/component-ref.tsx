import Block from '../../block';
import InteractiveElement from '../interactive-element';
import type { ComponentProps } from './component-ref.helpers';
import { getWrapperProps } from './component-ref.helpers';

function ComponentRef(props: ComponentProps) {
  const Wrapper = props.isInteractive ? InteractiveElement : props.componentRef;

  return (
    <>
      {props.componentRef ? (
        <>
          <Wrapper
            {...getWrapperProps({
              componentOptions: props.componentOptions,
              builderBlock: props.builderBlock,
              context: props.context,
              componentRef: props.componentRef,
              includeBlockProps: props.includeBlockProps,
              isInteractive: props.isInteractive,
              contextValue: props.context,
            })}
          >
            {props.blockChildren?.map(child => (
              <Block
                key={child.id}
                block={child}
                context={props.context}
                registeredComponents={props.registeredComponents}
              />
            ))}
          </Wrapper>
        </>
      ) : null}
    </>
  );
}

export default ComponentRef;
