/** See: https://devdocs.helcim.com/reference/purchase */
export interface HelcimPaymentPurchaseInput {
  /**
   * IP address of the customer making the transaction, used as part of fraud
   * detection.
   */
  ipAddress: string;
  /** The amount of the transaction to be processed */
  amount: number;
  /**
   * Currency abbreviation.
   *
   * Valid types: 'CAD' | 'USD'
   */
  currency: string;
  cardData: {
    /**
     * The token for the card on file. If Customer Code is filled, The card
     * should must be owned by a passed customer code
     */
    cardToken: string;
  };
}

/**
 * Potential payment outcomes
 *
 * A successful payment request will create a transaction object in the Helcim
 * system with a status that indicates the outcome of the payment.
 *
 * - A successful payment will contain a status with the value of 'APPROVED'.
 * - An unsuccessful payment will contain a status with the value of 'DECLINED'.
 *   It will also contain an errors value that contains more information on why
 *   the payment was declined.
 *
 * See:
 * https://devdocs.helcim.com/docs/process-a-credit-card-payment#potential-payment-outcomes
 */
export interface HelcimPaymentPurchaseOutput {
  transactionId: number;
  dateCreated: string;
  cardBatchId: number;
  status: string;
  user: string;
  type: string;
  amount: number;
  currency: string;
  avsResponse: string;
  cvvResponse: string;
  cardType: string;
  approvalCode: string;
  cardToken: string;
  cardNumber: string;
  cardHolderName: string;
  customerCode: string;
  invoiceNumber: string;
  warning: string;
}
