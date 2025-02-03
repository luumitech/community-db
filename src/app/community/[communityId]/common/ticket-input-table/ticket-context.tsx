import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { type TicketListFieldArray } from './_type';

export interface TicketListConfig {
  /**
   * Ticket List hook-form control name prefix
   *
   * I.e. `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList`
   */
  controlNamePrefix: string;
  /** UseFieldArray from this hook form field */
  fieldMethods: TicketListFieldArray;
}

export interface MembershipConfig {
  /**
   * Yearly membership inputs will appear as first row of the ticket list
   *
   * I.e. `membershipList.${yearIdx}`
   */
  controlNamePrefix: string;
  /** Should be allowed to change membership information */
  canEdit: boolean;
}

export interface TransactionConfig {
  /**
   * Existing ticket list
   *
   * Note: this does not include membership
   */
  ticketList: GQL.Ticket[];
}

interface TransactionUIConfig {
  /** Default payment method for newly added transactions */
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

type ContextT = Readonly<{
  ticketListConfig: TicketListConfig;
  membershipConfig?: MembershipConfig;
  transactionConfig?: TransactionConfig;
  includeHiddenFields?: boolean;
  transactionUIConfig: TransactionUIConfig;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  ticketListConfig: TicketListConfig;
  membershipConfig?: MembershipConfig;
  transactionConfig?: TransactionConfig;
  includeHiddenFields?: boolean;
  children: React.ReactNode;
}

export function TicketProvider({
  ticketListConfig,
  membershipConfig,
  transactionConfig,
  includeHiddenFields,
  ...props
}: Props) {
  const [paymentMethod, setPaymentMethod] = React.useState<string>('');

  return (
    <Context.Provider
      value={{
        ticketListConfig,
        membershipConfig,
        transactionConfig,
        includeHiddenFields,
        transactionUIConfig: {
          paymentMethod,
          setPaymentMethod,
        },
      }}
      {...props}
    />
  );
}

export function useTicketContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useTicketContext must be used within a TicketProvider`);
  }
  return context;
}
