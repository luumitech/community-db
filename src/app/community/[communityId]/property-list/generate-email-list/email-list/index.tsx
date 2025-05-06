import { ModalBody, ModalFooter } from '@heroui/react';
import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import type { PropertyEntry } from '../_type';
import { usePanelContext } from '../panel-context';
import { EmailListImpl } from './email-list';

interface Props {
  className?: string;
  propertyList: PropertyEntry[];
}

export const EmailList: React.FC<Props> = ({ className, propertyList }) => {
  const { goToPanel } = usePanelContext();

  return (
    <>
      <ModalBody>
        <EmailListImpl propertyList={propertyList} />
      </ModalBody>
      <ModalFooter className="justify-start">
        <Button
          variant="bordered"
          startContent={<Icon icon="back" />}
          onPress={() => goToPanel('filter-select', {})}
        >
          Back
        </Button>
      </ModalFooter>
    </>
  );
};
