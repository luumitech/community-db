import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { RoleItem } from './role-item';

interface Props {
  className?: string;
}

export const RoleDescription: React.FC<Props> = ({ className }) => {
  return (
    <Card className={clsx(className)} shadow="sm">
      <CardHeader>Role Definition</CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-2">
          <RoleItem role="Viewer">
            <span>View database content</span>
          </RoleItem>
          <RoleItem role="Editor">
            <span>
              Grant <span className="font-bold">Viewer</span> access
            </span>
            <span>Modify data within database</span>
          </RoleItem>
          <RoleItem role="Admin">
            <span>
              Grant <span className="font-bold">Editor</span> access
            </span>
            <span>Add or remove user access</span>
          </RoleItem>
        </div>
      </CardBody>
    </Card>
  );
};
