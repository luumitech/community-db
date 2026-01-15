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
      className={twMerge(
        CLASS_DEFAULT.inheritContainer,
        CLASS_DEFAULT.commonContainer,
        CLASS_DEFAULT.headerContainer,
        config?.commonContainer,
        config?.headerContainer
      )}
      role="columnheader"
      shadow="none"
      radius="sm"
      {...props}
    >
      <CardBody
        className={twMerge(
          // Override default padding in CardBody
          'p-0',
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.headerGrid,
          config?.headerGrid
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
