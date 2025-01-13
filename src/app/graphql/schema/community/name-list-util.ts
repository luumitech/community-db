import type {
  Property,
  SupportedEventItem,
  SupportedPaymentMethod,
  SupportedTicketItem,
} from '@prisma/client';
import * as GQL from '~/graphql/generated/graphql';
import { extractEventList } from '~/lib/lcra-community/import/event-list-util';
import { extractPaymentMethodList } from '~/lib/lcra-community/import/payment-method-list-util';
import { extractTicketList } from '~/lib/lcra-community/import/ticket-list-util';
import prisma from '~/lib/prisma';

type PropertyEntry = Pick<Property, 'membershipList'>;

export class NameListUtil {
  constructor(
    /**
     * List of all properties that contains the following name lists
     *
     * - Event names
     * - Ticket names
     * - Payment methods
     */
    private propertyList: PropertyEntry[]
  ) {}

  static async fromDB(communityId: string) {
    const propertyList = await prisma.property.findMany({
      where: { communityId },
      select: { membershipList: true },
    });
    return new NameListUtil(propertyList);
  }

  /**
   * Generate eventList entry for database
   *
   * User may want a reduced list of events to show when selecting in the UI,
   * but the database may contain events that are still being referenced, and
   * they need to be maintained in this list. We'll mark these entries as
   * hidden, so they would still show up properly in the selection UI
   *
   * @param eventList New event list as requested by user
   * @returns
   */
  getCompleteEventList(eventList: GQL.EventItemInput[]) {
    const result: SupportedEventItem[] = [];
    eventList.forEach(({ name }) => {
      result.push({ name, hidden: false });
    });

    // mark any events missing in the input eventList as hidden
    const completeEventList = extractEventList(this.propertyList);
    completeEventList.forEach((name) => {
      if (!eventList.find((entry) => entry.name === name)) {
        result.push({ name, hidden: true });
      }
    });

    return result;
  }

  /**
   * Generate ticketList entry for database
   *
   * User may want a reduced list of tickets to show when selecting in the UI,
   * but the database may contain ticket names that are still being referenced,
   * and they need to be maintained in this list. We'll mark these entries as
   * hidden, so they would still show up properly in the selection UI
   *
   * @param ticketList New ticket list as requested by user
   * @returns
   */
  getCompleteTicketList(ticketList: GQL.TicketItemInput[]) {
    const result: SupportedTicketItem[] = [];
    ticketList.forEach(({ name, count, unitPrice }) => {
      result.push({
        name,
        count: count ?? null,
        unitPrice: unitPrice ?? null,
        hidden: false,
      });
    });

    // mark any ticket names missing in the input ticketList as hidden
    const completeTicketList = extractTicketList(this.propertyList);
    completeTicketList.forEach((name) => {
      if (!ticketList.find((entry) => entry.name === name)) {
        result.push({ name, count: null, unitPrice: null, hidden: true });
      }
    });

    return result;
  }

  /**
   * Generate paymentMethodList entry for database
   *
   * User may want a reduced list of payment methods to show when selecting in
   * the UI, but the database may contain methods that are still being
   * referenced, and they need to be maintained in this list. We'll mark these
   * entries as hidden, so they would still show up properly in the selection
   * UI
   *
   * @param paymentMethodList New event list as requested by user
   * @returns
   */
  getCompletePaymentMethodList(paymentMethodList: GQL.PaymentMethodInput[]) {
    const result: SupportedPaymentMethod[] = [];
    paymentMethodList.forEach(({ name }) => {
      result.push({ name, hidden: false });
    });

    // mark any events missing in the input eventList as hidden
    const completePaymentMethodList = extractPaymentMethodList(
      this.propertyList
    );
    completePaymentMethodList.forEach((name) => {
      if (!paymentMethodList.find((entry) => entry.name === name)) {
        result.push({ name, hidden: true });
      }
    });

    return result;
  }
}
