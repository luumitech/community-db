import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { GoToWelcome } from '../go-to-welcome';

interface Props {
  className?: string;
}

export const SignUpReason: React.FC<Props> = ({ className }) => {
  const ListItem = React.useCallback(
    (props: React.PropsWithChildren<object>) => {
      return (
        <li className="flex items-center gap-2">
          <Icon className="text-green-600" icon="checkmark" />
          {props.children}
        </li>
      );
    },
    []
  );

  return (
    <div
      className={clsx(
        'h-[60vh] flex items-center justify-center',
        'bg-green-100 text-slate-700'
      )}
    >
      <div
        className={clsx(
          'm-12 sm:m-18 md:m-24',
          'flex flex-col items-center text-wrap gap-6'
        )}
      >
        <div className="text-2xl sm:text-3xl font-bold text-center">
          Keeping track of membership is a breeze with Community Database
        </div>
        <ol className="text-base sm:text-lg md:text-xl">
          <ListItem>Absolutely free to start</ListItem>
          <ListItem>Sign up with google account</ListItem>
          <ListItem>Visualize membership in dashboard</ListItem>
          <ListItem>Keep track of event ticket sales</ListItem>
        </ol>
        <GoToWelcome />
      </div>
    </div>
  );
};
