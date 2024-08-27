import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  role: string;
  children?: React.ReactNode;
}

export const RoleItem: React.FC<Props> = ({ className, role, children }) => {
  return (
    <div className={clsx(className, 'text-sm text-default-500')}>
      <span className="font-bold">{role}</span> role:
      {children && (
        <ul className="list-disc pl-6">
          {React.Children.map(children, (child, idx) => {
            if (React.isValidElement(child)) {
              return <li>{React.cloneElement(child, child.props)}</li>;
            }
            return null;
          })}
        </ul>
      )}
    </div>
  );
};
