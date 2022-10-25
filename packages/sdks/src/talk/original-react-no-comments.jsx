const Div = styled.div`
  display: flex;
  flex-direction: columns;
`;

function RenderContent(props) {
  useEffect(() => {
    sendComponentsToVisualEditor(props.customComponents);
  }, []);

  useEffect(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  return (
    <BuilderContext.Provider value={{ content: props.content }}>
      <Div onClick={() => trackClick(props.content.id)}>
        <RenderBlocks blocks={props.content.blocks} />
      </Div>
    </BuilderContext.Provider>
  );
}
