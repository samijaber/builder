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
    get content() {
      return props.content;
    },
    get registeredComponents() {
      return props.customComponents;
    },
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
