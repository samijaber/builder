'use client';
import type { ButtonProps } from './button.types';

function Button(props: ButtonProps) {
  return (
    <>
      {props.link ? (
        <>
          <a
            {...{}}
            {...props.attributes}
            href={props.link}
            target={props.openLinkInNewTab ? '_blank' : undefined}
            role={'button'}
          >
            {props.text}
          </a>
        </>
      ) : (
        <>
          <button
            {...{}}
            {...props.attributes}
            style={props.attributes.style}
            className={props.attributes.className + ' button-fdf49de0'}
          >
            {props.text}
          </button>
        </>
      )}

      <style>{`.button-fdf49de0 {
  all: unset;
}`}</style>
    </>
  );
}

export default Button;
