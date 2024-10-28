export type * from './pay-js';

/** See: https://devdocs.helcim.com/reference/checkout-init */
export interface HelcimPayInitializeInput {
  /**
   * Payment Type.
   *
   * Valid types: 'purchase' | 'preauth' | 'verify'
   */
  paymentType: string;
  /** The amount of the transaction to be processed */
  amount: number;
  /**
   * Currency abbreviation.
   *
   * Valid types: 'CAD' | 'USD'
   */
  currency: string;
}

/**
 * The checkoutToken and secretToken returned by the HelcimPay.js initialize
 * endpoint are only valid for 60 minutes after being returned. After this they
 * expire and you would need to call the initialization endpoint to receive new
 * tokens to render the HelcimPay.js modal.
 */
export interface HelcimPayInitializeOutput {
  /**
   * The secretToken is used for validation purposes after a transaction has
   * been processed successfully. This token, along with transaction data in the
   * response are used to create a hash. You can use this to verify that the
   * data in the transaction response is valid and has not been tampered with.
   */
  secretToken: string;
  /**
   * The checkoutToken is the key to displaying the HelcimPay.js modal using the
   * appendHelcimIframe function. This token ensures a secure connection between
   * the cardholder’s web browser and the Helcim Payment API endpoint. Please
   * note, the checkout token is a unique value for each payment instance, and
   * it expires after 60 minutes, or once the transaction is processed. Having
   * unique and recent checkout tokens reduces the likelihood that an
   * unauthorized payment is processed.
   */
  checkoutToken: string;
}
