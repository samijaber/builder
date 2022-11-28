export default function RenderContent(props) {
  onMount(() => {
    sendComponentsToVisualEditor(registeredComponent);
  });

  onUpdate(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  setContext(BuilderContext, {
    content: props.content,
    registeredComponents: props.customComponents,
  });

  return (
    <div
      css={{ display: 'flex', flexDirection: 'columns' }}
      onClick={() => trackClick(props.content.id)}
    >
      <RenderBlocks blocks={props.content.blocks} />
    </div>
  );
}
