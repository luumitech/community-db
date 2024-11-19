import React from 'react';

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
}

/** Custom Form that prevents enter key from submitting forms */
export const Form: React.FC<Props> = (props) => {
  const onKeyDown = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevent 'enter' key from submitting forms
    if (evt.key === 'Enter') {
      evt.preventDefault();
    }
  };

  return <form onKeyDown={onKeyDown} {...props} />;
};
