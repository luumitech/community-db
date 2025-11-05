import { cn } from '@heroui/react';
import React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  selected?: boolean;
}

export const DotButton: React.FC<Props> = ({ selected, ...props }) => {
  return (
    <button
      className={cn(
        'h-3 w-3 rounded-full border-2 border-gray-300',
        selected ? 'border-slate-500 bg-slate-500' : 'border-gray-300'
      )}
      {...props}
    />
  );
};
