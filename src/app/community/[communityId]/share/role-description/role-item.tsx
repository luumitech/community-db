import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  role: string;
  children?: React.ReactNode;
}

export const RoleItem: React.FC<Props> = ({ className, role, children }) => {
  return (
    <div className={twMerge('text-sm text-default-500', className)}>
      <span className="font-bold">{role}</span> role:
      {children && (
        <ul className="list-disc pl-6">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return <li>{React.cloneElement(child)}</li>;
            }
            return null;
          })}
        </ul>
      )}
    </div>
  );
};
