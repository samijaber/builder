'use client';
import type { SectionProps } from './section.types';

function SectionComponent(props: SectionProps) {
  return (
    <section
      {...{}}
      {...props.attributes}
      style={{
        width: '100%',
        alignSelf: 'stretch',
        flexGrow: 1,
        boxSizing: 'border-box',
        maxWidth: props.maxWidth || 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {props.children}
    </section>
  );
}

export default SectionComponent;
