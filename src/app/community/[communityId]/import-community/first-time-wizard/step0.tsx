import { Button, Tooltip } from '@heroui/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import { useLocalStorage } from 'usehooks-ts';
import { lsFlags } from '~/lib/env-var';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../page-context';

interface Props {
  className?: string;
}

export const Step0: React.FC<Props> = ({ className }) => {
  const [isFirstTime, setIsFirstTime] = useLocalStorage(
    lsFlags.importFirstTime,
    true
  );
  const { setSelectTooltip } = usePageContext();
  const { nextStep } = useWizard();

  React.useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      nextStep();
    }
  }, [isFirstTime, setIsFirstTime, nextStep]);

  React.useEffect(() => {
    setSelectTooltip(undefined);
  }, [setSelectTooltip]);

  return (
    <Tooltip
      className="max-w-xs"
      content="This wizard will guide you through the process of importing data into your community database."
    >
      <Button
        className="absolute bottom-4 right-4"
        isIconOnly
        size="sm"
        radius="full"
        onPress={nextStep}
      >
        <Icon icon="helpbook" />
      </Button>
    </Tooltip>
  );
};
