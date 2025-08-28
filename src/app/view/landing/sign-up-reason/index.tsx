import { cn } from '@heroui/react';
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
    <div className={cn('bg-green-100 text-slate-700')}>
      <div
        className={cn(
          'flex flex-col items-center text-center text-wrap gap-6',
          'p-9 sm:p-18 md:p-24'
        )}
      >
        <div className="text-2xl sm:text-3xl font-bold text-center">
          Keeping track of membership is a breeze with Community Database
        </div>
        <ol className="text-base text-left sm:text-lg md:text-xl">
          <ListItem>Absolutely free to start</ListItem>
          <ListItem>Sign up with email or Google account</ListItem>
          <ListItem>Add addresses easily using map view</ListItem>
          <ListItem>Visualize membership in dashboard</ListItem>
          <ListItem>Keep track of event ticket sales</ListItem>
        </ol>
        <GoToWelcome />
      </div>
    </div>
  );
};
