/**
 * Sample payload returned from HelcimPay.js upon successful validation of
 * payment information
 *
 * ```js
 * {
 *   "data": {
 *     "hash": "c798b9e1b8f9738f1316b1f83c8705da6d6458dc25905548bd853416257d3bed",
 *     "data": {
 *       "transactionId": "29131018",
 *       "dateCreated": "2024-10-08 13:11:35",
 *       "cardBatchId": "4013689",
 *       "status": "APPROVED",
 *       "type": "verify",
 *       "amount": "0",
 *       "currency": "CAD",
 *       "avsResponse": "X",
 *       "cvvResponse": "",
 *       "approvalCode": "T2E1ST",
 *       "cardToken": "ab2eb1d757aaa104283ce2",
 *       "cardNumber": "5454545454",
 *       "cardHolderName": "a d",
 *       "customerCode": "CST1003",
 *       "invoiceNumber": "",
 *       "warning": ""
 *     }
 *   },
 *   "status": 200,
 *   "statusText": "",
 *   "headers": { "content-type": "application/json" }
 * }
 * ```
 */
export interface HelcimPayJsCardInfoOutput {
  /**
   * Used for validating HelcimPay payload
   *
   * See: https://devdocs.helcim.com/docs/helcimpayjs-validation
   */
  hash: string;
  data: HelcimPayJsCardData;
}

export interface HelcimPayJsCardData {
  status: string;
  type: string;
  amount: string;
  currency: string;
  avsResponse: string;
  cvvResponse: string;
  approvalCode: string;
  cardToken: string;
  cardNumber: string;
  cardHolderName: string;
  customerCode: string;
  invoiceNumber: string;
  warning: string;
}
