import { useMutation } from '@apollo/client';
import { Button, ButtonProps } from '@nextui-org/react';
import clsx from 'clsx';
import Script from 'next/script';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import type { HelcimPayJsCardInfoOutput } from '~/lib/helcim-api/_type';
import { toast } from '~/view/base/toastify';

/**
 * Convert arraybuffer to hex string
 *
 * See: https://stackoverflow.com/a/40031979/9014097
 */
function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create SHA256 hash signature for an arbitrary payload
 *
 * See:
 * https://devdocs.helcim.com/docs/helcimpayjs-validation#generate-and-compare-your-transaction-response-hash
 */
async function sha256(payload: string, secretToken: string) {
  const inputBytes = new TextEncoder().encode(payload + secretToken);
  const hashBytes = await crypto.subtle.digest('SHA-256', inputBytes);
  return buf2hex(hashBytes);
}

/**
 * See:
 * https://devdocs.helcim.com/docs/helcimpayjs-implementation#listening-to-response-events
 */
interface HelcimPayJsMessageEvent {
  /**
   * An identifier that indicates that the postMessage is from the HelcimPay.js
   * iFrame.
   *
   * Helcim pay events starts with `helcim-pay-js-`
   */
  eventName: string;
  /** Indicates the outcome of the transaction process. */
  eventStatus: 'ABORTED' | 'SUCCESS';
  /**
   * The response from the transaction process, which can only either be:
   *
   * - A transaction response object that indicates that the process is successful
   * - An error message saying "HelcimPay.js transaction failed -
   *   additional-error-message-here"
   *
   * JSON string containing HelcimPayJsMessagePayload
   */
  eventMessage: string;
}

const HelcimPayInitialize = graphql(/* GraphQL */ `
  mutation helcimPayInitialize($input: HelcimPayInitializeInput!) {
    helcimPayInitialize(input: $input) {
      checkoutToken
      secretToken
      idempotentKey
      ipAddress
    }
  }
`);

const HelcimPurchase = graphql(/* GraphQL */ `
  mutation helcimPurchase($input: HelcimPurchaseInput!) {
    helcimPurchase(input: $input) {
      id
      subscription {
        id
        paymentType
        status
      }
    }
  }
`);

interface Props extends ButtonProps {
  className?: string;
  /** Called when payment has been successfully processed */
  onSuccess?: () => void;
}

export const ProcessPaymentButton: React.FC<Props> = ({
  className,
  onSuccess,
  ...buttonProps
}) => {
  const [payInitialize, payInitializeResult] = useMutation(HelcimPayInitialize);
  const [purchase, purchaseResult] = useMutation(HelcimPurchase);
  const payInitializeResultRef = React.useRef<GQL.HelcimPayInitializeOutput>();

  /**
   * HelcimPay.js Validation
   *
   * See: https://devdocs.helcim.com/docs/helcimpayjs-validation
   */
  const validateHelcimPayJsMessage = React.useCallback(
    async (message: string, secretToken: string) => {
      const resp = JSON.parse(message) as {
        data: HelcimPayJsCardInfoOutput;
      };
      const { hash, data } = resp.data;
      const expectedHash = await sha256(JSON.stringify(data), secretToken);
      if (hash !== expectedHash) {
        throw new Error(
          'Payment Information Validation error. Please try again.'
        );
      }
      return data;
    },
    []
  );

  /** This is called once the payment information is verified by Helcim */
  const processPayment = React.useCallback(
    async (event: MessageEvent<HelcimPayJsMessageEvent>) => {
      /**
       * Remove HelcimPay IFrame, after successful processing
       *
       * See: https://devdocs.helcim.com/docs/remove-the-helcimpayjs-iframe
       */
      const removeHelcimPayIframe = () => {
        const frame = document.getElementById('helcimPayIframe');
        if (frame instanceof HTMLIFrameElement) {
          frame.remove();
          window.removeEventListener('message', processPayment);
        }
      };

      if (!payInitializeResultRef.current) {
        return;
      }
      const { checkoutToken, secretToken, idempotentKey, ipAddress } =
        payInitializeResultRef.current;
      const helcimPayJsIdentifierKey = `helcim-pay-js-${checkoutToken}`;

      if (event.data.eventName === helcimPayJsIdentifierKey) {
        if (event.data.eventStatus === 'ABORTED') {
          console.error('Transaction failed!', event.data.eventMessage);
        }

        if (event.data.eventStatus === 'SUCCESS') {
          try {
            const payload = await validateHelcimPayJsMessage(
              event.data.eventMessage,
              secretToken
            );
            const result = await purchase({
              variables: {
                input: {
                  cardToken: payload.cardToken,
                  customerCode: payload.customerCode,
                  idempotentKey,
                  ipAddress,
                },
              },
            });
            onSuccess?.();
          } catch (err) {
            if (err instanceof Error) {
              toast.error(err.message);
            }
          } finally {
            removeHelcimPayIframe();
          }
        }
      }
    },
    [validateHelcimPayJsMessage, purchase, onSuccess]
  );

  const myPurchase = async () => {
    const payload = {
      data: {
        transactionId: '29153833',
        dateCreated: '2024-10-09 11:51:17',
        cardBatchId: '4016308',
        status: 'APPROVED',
        type: 'verify',
        amount: '0',
        currency: 'CAD',
        avsResponse: 'X',
        cvvResponse: '',
        approvalCode: 'T9E9ST',
        cardToken: '785e32dc75a397fd35fd02',
        cardNumber: '5454545454',
        cardHolderName: 'asdf adsf',
        customerCode: 'CST1014',
        invoiceNumber: '',
        warning: '',
      },
      hash: '1b21727972227752244cec5d663ca3b27a671fb4bff6414757ac9e60e9291665',
    };

    // const result = await purchase({
    //   variables: {
    //     input: {
    //       idempotentKey: '',
    //       cardToken: payload.data.cardToken,
    //       ipAddress: '123.123.123.123',
    //     },
    //   },
    // });
  };

  const gatherPaymentInfo = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    async (evt) => {
      try {
        const result = await payInitialize({
          variables: {
            input: { paymentType: 'verify', amount: 0, currency: 'CAD' },
          },
        });
        const helcimPayInitialize = result.data?.helcimPayInitialize;
        if (helcimPayInitialize?.checkoutToken) {
          /**
           * Once appendHelcimPayIframe() is called, the payment process is
           * initiated. After the process finishes, the transaction response can
           * be retrieved by listening to the response emitted by the iFrame as
           * shown.
           *
           * See:
           * https://devdocs.helcim.com/docs/helcimpayjs-implementation#listening-to-response-events
           */
          window.addEventListener('message', processPayment);
          payInitializeResultRef.current = helcimPayInitialize;
          // Display Helcim Pay payment model
          //@ts-expect-error provided by helcim-pay script
          appendHelcimPayIframe(helcimPayInitialize.checkoutToken);
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    },
    [payInitialize, processPayment]
  );

  return (
    <>
      <Script src="https://secure.helcim.app/helcim-pay/services/start.js" />
      <Button
        className={className}
        onClick={gatherPaymentInfo}
        isLoading={payInitializeResult.loading || purchaseResult.loading}
        {...buttonProps}
      />
      {/* <Button onClick={myPurchase} isLoading={purchaseResult.loading}>
        Test
      </Button> */}
    </>
  );
};
