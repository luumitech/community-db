import { Button } from '@heroui/react';
import React from 'react';
import { Card } from '~/view/base/card';
import { Icon } from '~/view/base/icon';
import { type WizardContext } from './wizard';

interface Props {
  wizardContext: WizardContext;
  title?: React.ReactNode;
  body?: React.ReactNode;
}

export const StepTemplate: React.FC<Props> = ({
  wizardContext,
  title,
  body,
}) => {
  const { activeStep, isLastStep, goTo, goPrev, goNext } = wizardContext;

  return (
    <Card className="w-[inherit]" shadow="none">
      <Button
        className="absolute top-1 right-1 z-20"
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        onPress={() => goTo(0)}
      >
        <Icon icon="cross" />
      </Button>
      {title && <Card.Header className="font-semibold">{title}</Card.Header>}
      {body && <Card.Body>{body}</Card.Body>}
      <Card.Footer className="gap-2">
        <Button
          size="sm"
          isIconOnly
          variant="ghost"
          isDisabled={activeStep === 1}
          onPress={goPrev}
        >
          <Icon className="rotate-180" icon="chevron-forward" />
        </Button>
        {isLastStep ? (
          <>
            <div className="grow" />
            <Button size="sm" variant="ghost" onPress={() => goTo(0)}>
              End
            </Button>
          </>
        ) : (
          <Button size="sm" isIconOnly variant="ghost" onPress={goNext}>
            <Icon icon="chevron-forward" />
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};
