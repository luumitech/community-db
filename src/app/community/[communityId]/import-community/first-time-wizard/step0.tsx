import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { Button } from '~/view/base/button';
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
    <Button
      className="absolute right-4 bottom-4"
      isIconOnly
      size="sm"
      radius="full"
      tooltip="This wizard will guide you through the process of importing data into your community database."
      tooltipProps={{ className: 'max-w-xs' }}
      onPress={goNext}
    >
      <Icon icon="helpbook" />
    </Button>
  );
};
