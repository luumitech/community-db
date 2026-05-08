import { type UseFieldArrayReturn } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { isNonZeroDec } from '~/lib/decimal-util';
import { isInteger, isPositive, z, zz } from '~/lib/zod';

interface TicketListBaseSchemaOpt {
  validatePaymentMethod?: boolean;
}

export function ticketListSchema(opt?: TicketListBaseSchemaOpt) {
  return z.array(
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
        paymentDate: zz.coerce.toIsoDate({ nullable: true }),
      })
      .refine(
        (form) => {
          // Payment Method is only required when price is not zero
          if (opt?.validatePaymentMethod && isNonZeroDec(form.price)) {
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
}

export type TicketList = z.infer<ReturnType<typeof ticketListSchema>>;
export type Ticket = TicketList[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TicketListFieldArray = UseFieldArrayReturn<any, any>;

export type ExistingMembership = Pick<
  GQL.Membership,
  | 'year'
  | 'isMember'
  | 'paymentEventName'
  | 'price'
  | 'paymentDate'
  | 'paymentMethod'
>;
