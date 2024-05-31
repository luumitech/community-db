'use client';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Listbox,
  ListboxItem,
  Skeleton,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

interface MenuEntry {
  id: string;
  name?: string | null;
  href?: string;
}

interface Props {
  className?: string;
  header?: string;
  items: MenuEntry[];
  loading?: boolean;
}

export const MainMenu: React.FC<Props> = ({
  className,
  header,
  items,
  loading,
}) => {
  return (
    <div
      className={clsx(className, 'flex flex-row justify-center items-center')}
    >
      <Card className="w-80 md:w-96">
        {!!header && (
          <>
            <CardHeader>
              <p className="text-lg">{header}</p>
            </CardHeader>
            <Divider />
          </>
        )}
        <CardBody>
          {loading ? (
            <Skeleton className="rounded-lg">
              <div className="h-8 rounded-lg bg-default-300" />
            </Skeleton>
          ) : (
            <Listbox aria-label="main menu">
              {items.map((item) => (
                <ListboxItem key={item.id} href={item.href}>
                  {item.name ?? 'n/a'}
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
