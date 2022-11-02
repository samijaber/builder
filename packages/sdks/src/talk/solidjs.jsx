import { onMount, on, createEffect } from 'solid-js';
import { css } from 'solid-styled-components';

function RenderContent(props) {
  onMount(() => {
    sendComponentsToVisualEditor(props.customComponents);
  });

  createEffect(
    on(
      () => [props.content],
      () => {
        dispatchNewContentToVisualEditor(props.content);
      }
    )
  );

  return (
    <BuilderContext.Provider
      value={{
        content: props.content,
        registeredComponents: props.customComponents,
      }}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: 'columns',
        })}
        onClick={() => trackClick(props.content.id)}
      >
        <RenderBlocks blocks={props.content.blocks}></RenderBlocks>
      </div>
    </BuilderContext.Provider>
  );
}
