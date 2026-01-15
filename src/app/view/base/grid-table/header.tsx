import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from './_config';
import type { CommonProps, HeaderRenderer } from './_type';

interface Props extends CardProps, CommonProps {
  renderHeader: HeaderRenderer<string>;
}

export function Header(_props: Props) {
  const { config, columnKeys, columnConfig, renderHeader, ...props } = _props;
  return (
    <Card
      className={twMerge('bg-default-200/50', CLASS_DEFAULT.inheritContainer)}
      role="rowheader"
      shadow="none"
      radius="sm"
      {...props}
    >
      <CardBody
        className={twMerge(
          'items-center',
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.commonContainer,
          CLASS_DEFAULT.headerContainer,
          config?.commonContainer,
          config?.headerContainer
        )}
      >
        {columnKeys.map((key) => {
          return (
            <div key={key} className={twMerge(columnConfig?.[key])}>
              {renderHeader(key)}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
