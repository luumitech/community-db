import { Button, Tooltip } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../page-context';
import { Wizard } from './wizard';

interface Props {
  className?: string;
}

export const Step0: React.FC<Props> = ({ className }) => {
  const [isFirstTime = true, setIsFirstTime] = useLocalStorage(
    lsFlags.importFirstTime,
    true
  );
  const { setSelectTooltip } = usePageContext();
  const { goNext } = Wizard.useWizard();

  React.useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      goNext();
    }
  }, [isFirstTime, setIsFirstTime, goNext]);

  React.useEffect(() => {
    setSelectTooltip(undefined);
  }, [setSelectTooltip]);

  return (
    <Tooltip
      className="max-w-xs"
      content="This wizard will guide you through the process of importing data into your community database."
    >
      <Button
        className="absolute right-4 bottom-4"
        isIconOnly
        size="sm"
        radius="full"
        onPress={goNext}
      >
        <Icon icon="helpbook" />
      </Button>
    </Tooltip>
  );
};
