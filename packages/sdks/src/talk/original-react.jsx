function RenderContent(props) {
  // on mount, send all registered components to the visual editor
  useEffect(() => {
    Object.values(props.customComponents).forEach((registeredComponent) => {
      sendComponentToVisualEditor(registeredComponent);
    });
  }, []);

  // every time content changes, dispatch custom event to visual editor
  useEffect(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  return (
    // set context for child components
    <BuilderContext.Provider
      value={{
        content: props.content,
        registeredComponents: props.customComponents,
      }}
    >
      {/* track clicks */}
      <div onClick={() => trackClick(props.content.id)}>
        <RenderBlocks blocks={props.content.blocks} />
      </div>
    </BuilderContext.Provider>
  );
}
