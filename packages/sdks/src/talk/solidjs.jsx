import { onMount, on, createEffect } from 'solid-js';

function RenderContent(props) {
  onMount(() => {
    Object.values(props.customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
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
      <div onClick={(event) => trackClick(props.content.id)}>
        <RenderBlocks blocks={props.content.blocks}></RenderBlocks>
      </div>
    </BuilderContext.Provider>
  );
}
