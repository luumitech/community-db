import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import React from 'react';
import { type WizardValues } from 'react-use-wizard';
import { Icon } from '~/view/base/icon';

interface Props {
  wizardValues: WizardValues;
  title?: React.ReactNode;
  body?: React.ReactNode;
}

export const StepTemplate: React.FC<Props> = ({
  wizardValues,
  title,
  body,
}) => {
  const { activeStep, isLastStep, previousStep, nextStep, goToStep } =
    wizardValues;

  return (
    <Card className="w-[inherit]" shadow="none">
      <Button
        className="absolute right-1 top-1 z-20"
        isIconOnly
        size="sm"
        radius="full"
        variant="light"
        onPress={() => goToStep(0)}
      >
        <Icon icon="cross" />
      </Button>
      {title && <CardHeader className="font-semibold">{title}</CardHeader>}
      {body && <CardBody>{body}</CardBody>}
      <CardFooter className="gap-2">
        <Button
          size="sm"
          isIconOnly
          variant="ghost"
          isDisabled={activeStep === 1}
          onPress={previousStep}
        >
          <Icon className="rotate-180" icon="chevron-forward" />
        </Button>
        {isLastStep ? (
          <>
            <div className="grow" />
            <Button size="sm" variant="ghost" onPress={() => goToStep(0)}>
              End
            </Button>
          </>
        ) : (
          <Button size="sm" isIconOnly variant="ghost" onPress={nextStep}>
            <Icon icon="chevron-forward" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
