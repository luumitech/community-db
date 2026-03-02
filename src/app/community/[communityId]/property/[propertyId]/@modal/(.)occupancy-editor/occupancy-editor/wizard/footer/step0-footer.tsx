import { Button } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/occupancy-editor-context';
import { useHookFormContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { type WizardContext } from '..';

interface Props {
  context: WizardContext;
}

export const Step0Footer: React.FC<Props> = ({ context }) => {
  const { isPending, closeModal } = useOccupancyEditorContext();
  const { formState } = useHookFormContext();

  return (
    <>
      <Button variant="bordered" isDisabled={isPending} onPress={closeModal}>
        Cancel
      </Button>
      <Button
        type="submit"
        color="primary"
        isDisabled={!formState.isDirty}
        isLoading={isPending}
      >
        Save
      </Button>
    </>
  );
};
