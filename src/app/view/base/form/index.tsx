import React from 'react';

/** Custom Form that prevents enter key from submitting forms */
export const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLProps<HTMLFormElement>
>((props, ref) => {
  const onKeyDown = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevent 'enter' key from submitting forms
    if (evt.key === 'Enter') {
      /**
       * In the case of text area, we still want to allow enter key to create
       * new lines
       */
      if (
        evt.target instanceof HTMLTextAreaElement &&
        evt.target.nodeName === 'TEXTAREA'
      ) {
        return;
      }

      evt.preventDefault();
    }
  };

  return <form ref={ref} onKeyDown={onKeyDown} {...props} />;
});

Form.displayName = 'Form';
