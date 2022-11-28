import {
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
  useStylesScoped$,
  useWatch$,
} from '@builder.io/qwik';

export const RenderContent = component$((props) => {
  useStylesScoped$(STYLES);

  useContextProvider(
    BuilderContext,
    useStore({
      content: props.content,
      registeredComponents: props.customComponents,
    })
  );

  useClientEffect$(() => {
    sendComponentsToVisualEditor(registeredComponent);
  });

  useWatch$(({ track }) => {
    props && track(props, 'content');
    dispatchNewContentToVisualEditor(props.content);
  });

  return (
    <div
      class="div-RenderContent"
      onClick$={(event) => trackClick(props.content.id)}
    >
      <RenderBlocks blocks={props.content.blocks}></RenderBlocks>
    </div>
  );
});
export default RenderContent;

export const STYLES = `
  .div-RenderContent { 
  display: flex;
  flex-direction: columns; 
}
`;
