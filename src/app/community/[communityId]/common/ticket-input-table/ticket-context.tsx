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
   * Control name prefix for fields within the `Current Transaction Total`
   *
   * For example, used for payment method selection
   */
  controlNamePrefix: string;
  /**
   * Existing ticket list
   *
   * Note: this does not include membership
   */
  ticketList: GQL.Ticket[];
}

type ContextT = Readonly<{
  ticketListConfig: TicketListConfig;
  membershipConfig?: MembershipConfig;
  transactionConfig?: TransactionConfig;
  includeHiddenFields?: boolean;
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
  return (
    <Context.Provider
      value={{
        ticketListConfig,
        membershipConfig,
        transactionConfig,
        includeHiddenFields,
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
