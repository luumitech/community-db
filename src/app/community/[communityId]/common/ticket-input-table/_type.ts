import { type UseFieldArrayReturn } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

export const ticketSchema = z.object({
  ticketName: zz.string.nonEmpty('Must specify a value'),
  count: z.coerce
    .number({ message: 'Must be a number' })
    .int()
    .min(0)
    .nullable(),
  paymentMethod: z.string().nullable(),
  price: z.string().nullable(),
});

export type Ticket = z.infer<typeof ticketSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TicketListFieldArray = UseFieldArrayReturn<any, any>;
