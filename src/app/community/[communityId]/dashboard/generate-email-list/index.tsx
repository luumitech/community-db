import {
  Card,
  CardBody,
  CardHeader,
  Listbox,
  ListboxItem,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { HasMember } from './has-member';
import { MissingRenewal } from './missing-renewal';
import { NonMember } from './non-member';

interface Props {
  className?: string;
  communityId: string;
  year: number;
}

export const GenerateEmailList: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{year} Email List Generator</p>
        </div>
      </CardHeader>
      <CardBody>
        <Listbox aria-label="Email List Generator">
          <ListboxItem
            key="missing"
            textValue="missing"
            startContent={<Icon icon="copy" />}
            description={
              <MissingRenewal communityId={communityId} year={year} />
            }
          />
          <ListboxItem
            key="non-member"
            textValue="non-member"
            startContent={<Icon icon="copy" />}
            description={<NonMember communityId={communityId} year={year} />}
          />
          <ListboxItem
            key="has-member"
            textValue="has-member"
            startContent={<Icon icon="copy" />}
            description={<HasMember communityId={communityId} year={year} />}
          />
        </Listbox>
      </CardBody>
    </Card>
  );
};
