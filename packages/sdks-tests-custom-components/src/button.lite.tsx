import { Show } from '@builder.io/mitosis';

export interface ButtonProps {
  attributes?: any;
  text?: string;
  link?: string;
  openLinkInNewTab?: boolean;
}

/**
 * Custom Button component that adds a `cyan` color.
 */
export default function Button(props: ButtonProps) {
  return (
    <Show
      when={props.link}
      else={
        <button css={{ all: 'unset', color: 'cyan' }} {...props.attributes}>
          {props.text}
        </button>
      }
    >
      <a
        css={{ color: 'cyan' }}
        role="button"
        href={props.link}
        target={props.openLinkInNewTab ? '_blank' : undefined}
        {...props.attributes}
      >
        {props.text}
      </a>
    </Show>
  );
}
