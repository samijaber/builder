import Block from '../block/block';
import BlocksWrapper from './blocks-wrapper';
import type { BlocksProps } from './blocks.types';

function Blocks(props: BlocksProps) {
  return (
    <BlocksWrapper
      blocks={props.blocks}
      parent={props.parent}
      path={props.path}
      styleProp={props.styleProp}
      BlocksWrapper={props.context?.BlocksWrapper}
      BlocksWrapperProps={props.context?.BlocksWrapperProps}
    >
      {props.blocks ? (
        <>
          {props.blocks?.map(block => (
            <Block
              key={block.id}
              block={block}
              context={props.context}
              registeredComponents={props.registeredComponents}
            />
          ))}
        </>
      ) : null}
    </BlocksWrapper>
  );
}

export default Blocks;
