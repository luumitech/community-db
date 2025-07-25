import { type UseFieldArrayReturn } from '~/custom-hooks/hook-form';
import { isNonZeroDec } from '~/lib/decimal-util';
import { isInteger, isPositive, z, zz } from '~/lib/zod';

export const ticketListSchema = z.array(
  z
    .object({
      ticketName: zz.string.nonEmpty('Must specify a value'),
      count: zz.coerce.toNumber({
        message: 'Must be a number',
        nullable: true,
        validateFn: [isPositive(), isInteger()],
      }),
      paymentMethod: z.string().nullable(),
      price: zz.coerce.toCurrency(),
    })
    .refine(
      (form) => {
        // Payment Method is only required when price is not zero
        if (isNonZeroDec(form.price)) {
          return !!form.paymentMethod;
        }
        return true;
      },
      {
        message: 'Must specify Payment Method when Price is specified',
        path: ['paymentMethod'],
      }
    )
    .refine(
      (form) => {
        // Price is required if count is not specified
        const hasCount = form.count != null && form.count !== 0;
        if (!hasCount) {
          return isNonZeroDec(form.price);
        }
        return true;
      },
      {
        message: 'Must specify price when Ticket # is not specified',
        path: ['price'],
      }
    )
);

export type TicketList = z.infer<typeof ticketListSchema>;
export type Ticket = TicketList[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TicketListFieldArray = UseFieldArrayReturn<any, any>;
