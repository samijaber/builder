function RenderContent(props) {
  useEffect(() => {
    sendComponentsToVisualEditor(props.customComponents);
  }, []);

  useEffect(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  return (
    <BuilderContext.Provider
      value={{
        content: props.content,
        registeredComponents: props.customComponents,
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        onClick={() => trackClick(props.content.id)}
      >
        <RenderBlocks blocks={props.content.blocks} />
      </div>
    </BuilderContext.Provider>
  );
}
