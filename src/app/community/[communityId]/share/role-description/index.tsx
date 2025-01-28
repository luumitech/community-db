import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/react';
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
              In addition to <span className="font-bold">Viewer</span> role:
            </span>
            <span>Modify community data</span>
            <span>Modify property data</span>
          </RoleItem>
          <RoleItem role="Admin">
            <span>
              In addition to <span className="font-bold">Editor</span> role:
            </span>
            <span>Add or remove user access</span>
            <span>Create or remove community</span>
            <span>Import new data into community</span>
            <span>Create or remove property</span>
          </RoleItem>
        </div>
      </CardBody>
    </Card>
  );
};
