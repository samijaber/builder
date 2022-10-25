const Div = styled.div`
  display: flex;
  flex-direction: columns;
`;

function RenderContent(props) {
  // run code once (on mount)
  useEffect(() => {
    sendComponentsToVisualEditor(props.customComponents);
  }, []);

  // every time content changes, dispatch custom event to visual editor
  useEffect(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  return (
    // set context for child components
    <BuilderContext.Provider value={{ content: props.content }}>
      {/* track clicks */}
      <Div onClick={() => trackClick(props.content.id)}>
        <RenderBlocks blocks={props.content.blocks} />
      </Div>
    </BuilderContext.Provider>
  );
}
