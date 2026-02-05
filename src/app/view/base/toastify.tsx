import { Button, Link, cn } from '@heroui/react';
import React from 'react';
import {
  toast as toastify,
  type Id,
  type ToastContent,
  type ToastOptions,
  type ToastPromiseParams,
  type UpdateOptions,
} from 'react-toastify';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

export { type Id } from 'react-toastify';

interface ErrorDialogProps {
  className?: string;
  error: Error;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  className,
  error,
}) => {
  const errMsg = error.message || 'Unknown error';

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <p className="leading-4">
        <span>{errMsg}</span>
      </p>
      <Button
        variant="faded"
        size="sm"
        as={Link}
        href={appPath('contactUs', {
          query: {
            title: 'Report An Issue',
            subject: errMsg,
            messageDescription: `Describe the issue in detail:
              - What were you trying to do?
              - Please include detail steps leading you to the error
              - Include the error message you received`,
            log: 'true',
          },
        })}
        startContent={<Icon icon="bug" />}
      >
        Report An Issue
      </Button>
    </div>
  );
};

/**
 * Customize toast.promise to handle error condition automatically
 *
 * @returns
 */
async function toastPromise<
  TData = unknown,
  TError = unknown,
  TPending = unknown,
>(
  promise: Promise<TData> | (() => Promise<TData>),
  { pending, error, success }: ToastPromiseParams<TData, TError, TPending>,
  options?: ToastOptions<TData>
): Promise<TData | undefined> {
  // default error handler
  const customError: string | UpdateOptions<TError> = {
    // Don't close the error
    autoClose: false,
    render: ({ data }) => {
      if (data instanceof Error) {
        return <ErrorDialog error={data} />;
      }
    },
  };

  const result = await toastify.promise(
    promise,
    {
      pending,
      ...(error === 'disabled'
        ? /**
           * User can pass 'disabled', to prevent error toast from showing when promise
           * is rejected
           */
          {}
        : { error: error ?? customError }),
      success,
    },
    options
  );
  return result;
}

/**
 * Customize toast.error:
 *
 * - Should not automatically dismiss
 *
 * @returns
 */
function toastError<TData = unknown>(
  content: ToastContent<TData>,
  options?: ToastOptions<TData> | undefined
): Id {
  return toastify.error(content, {
    autoClose: false,
    ...options,
  });
}

/**
 * Customize react-toastify toast object
 *
 * - Toast.promise will display error message automatically
 */
export const toast = {
  ...toastify,
  promise: toastPromise,
  error: toastError,
};
