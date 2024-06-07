'use client';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react';
import { SelectTheme } from './select-theme';

interface Params {}

interface RouteArgs {
  params: Params;
}

export default function Preference({ params }: RouteArgs) {
  return (
    <Card>
      <CardHeader className="text-2xl">Preference</CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>Theme</div>
          <SelectTheme />
        </div>
      </CardBody>
    </Card>
  );
}
