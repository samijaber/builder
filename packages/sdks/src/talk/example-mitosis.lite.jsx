export default function RenderContent(props) {
  onMount(() => {
    Object.values(props.customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
  });

  onUpdate(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  setContext(BuilderContext, {
    content: props.content,
    registeredComponents: props.customComponents,
  });

  return (
    <div onClick={() => trackClick(props.content.id)}>
      <RenderBlocks blocks={props.content.blocks} />
    </div>
  );
}
