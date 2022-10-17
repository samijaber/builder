import {
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
  useWatch$,
} from '@builder.io/qwik';

export const RenderContent = component$((props) => {
  useContextProvider(
    BuilderContext,
    useStore({
      content: content,
      registeredComponents: customComponents,
    })
  );

  useClientEffect$(() => {
    Object.values(props.customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
  });

  useWatch$(({ track }) => {
    track(props, 'content');
    dispatchNewContentToVisualEditor(props.content);
  });

  return (
    <div onClick$={(event) => trackClick(props.content.id)}>
      <RenderBlocks blocks={props.content.blocks}></RenderBlocks>
    </div>
  );
});
