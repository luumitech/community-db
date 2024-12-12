import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@nextui-org/react';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { HiddenList } from './hidden-list';
import { VisibleList } from './visible-list';

interface Props {
  className?: string;
}

export const PaymentMethodListEditor: React.FC<Props> = ({ className }) => {
  const [newItem, setNewItem] = React.useState<string>('');
  const { control } = useHookFormContext();
  const paymentMethods = useFieldArray({
    control,
    name: 'paymentMethodList',
  });
  const hiddenPaymentMethods = useFieldArray({
    control,
    name: 'hidden.paymentMethodList',
  });

  /** Item can only be added if it is different than the ones on the visible list */
  const isItemValid = React.useCallback(
    (itemName: string) => {
      const allEvents = [
        ...paymentMethods.fields,
        ...hiddenPaymentMethods.fields,
      ];
      const found = allEvents.find(
        ({ name }) =>
          !name.localeCompare(itemName, undefined, { sensitivity: 'accent' })
      );
      return !found;
    },
    [paymentMethods.fields, hiddenPaymentMethods.fields]
  );

  const addVisibleItem = React.useCallback(
    (itemName: string) => {
      paymentMethods.append({ name: itemName });
    },
    [paymentMethods]
  );

  const addIsDisabled = React.useMemo(() => {
    return !newItem || !isItemValid(newItem);
  }, [newItem, isItemValid]);

  const addNewItem = React.useCallback(() => {
    if (!addIsDisabled) {
      addVisibleItem(newItem);
      setNewItem('');
    }
  }, [newItem, addVisibleItem, addIsDisabled]);

  const addHiddenItem = React.useCallback(
    (itemName: string) => {
      hiddenPaymentMethods.append({ name: itemName });
    },
    [hiddenPaymentMethods]
  );

  return (
    <Card shadow="none" className="border-2">
      <CardHeader>
        <div className="flex flex-col text-foreground-500">
          <p className="text-small">Payment Methods</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-start gap-4">
          <VisibleList fieldArray={paymentMethods} onRemove={addHiddenItem} />
          <HiddenList
            fieldArray={hiddenPaymentMethods}
            onRemove={addVisibleItem}
          />
        </div>
      </CardBody>
      <CardFooter className="gap-2 items-start">
        <Input
          className="max-w-xs"
          aria-label="New payment method"
          placeholder="Enter new payment method"
          value={newItem}
          onValueChange={setNewItem}
          errorMessage="Method name must be unique"
          isInvalid={!isItemValid(newItem)}
        />
        <Button
          className="text-primary"
          endContent={<Icon icon="add" />}
          variant="faded"
          onPress={addNewItem}
          isDisabled={addIsDisabled}
        >
          Add Payment Method
        </Button>
      </CardFooter>
    </Card>
  );
};
