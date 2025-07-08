import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { decIsEqual, decMul } from '~/lib/decimal-util';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  controlNamePrefix: string;
}

export const PriceInput: React.FC<Props> = ({
  className,
  controlNamePrefix,
  ...props
}) => {
  const { ticketDefault } = useLayoutContext();
  const { setValue, watch, clearErrors } = useFormContext();
  const ticketType = watch(`${controlNamePrefix}.ticketName`);
  const ticketCount = watch(`${controlNamePrefix}.count`) as number;
  const price = watch(`${controlNamePrefix}.price`);

  const ticketDef = ticketDefault.get(ticketType);
  const unitPrice = ticketDef?.unitPrice;
  const defaultPrice = React.useMemo(() => {
    if (unitPrice == null || ticketCount == null || isNaN(ticketCount)) {
      return null;
    }
    return decMul(unitPrice, ticketCount);
  }, [unitPrice, ticketCount]);

  const onChange: NonNullable<CurrencyInputProps['onChange']> =
    React.useCallback(
      (evt) => {
        /**
         * This is needed because paymentMethod's validation error is triggered
         * based on value of price
         */
        clearErrors(`${controlNamePrefix}.paymentMethod`);
        clearErrors(`${controlNamePrefix}.price`);
      },
      [clearErrors, controlNamePrefix]
    );

  return (
    <CurrencyInput
      classNames={{
        base: cn(className),
        // This will align input and select items text on the same line
        innerWrapper: cn('pb-0'),
      }}
      controlName={`${controlNamePrefix}.price`}
      isControlled
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      {...(defaultPrice != null &&
        !decIsEqual(defaultPrice, price) && {
          description: (
            <span className="text-warning">Price has been overridden</span>
          ),
        })}
      endContent={
        defaultPrice != null && (
          <FlatButton
            icon="calculator"
            tooltip={`${ticketCount} * $${unitPrice} = $${defaultPrice}`}
            onClick={() => {
              setValue(`${controlNamePrefix}.price`, defaultPrice, {
                shouldDirty: true,
              });
            }}
          />
        )
      }
      onChange={onChange}
      {...props}
    />
  );
};
