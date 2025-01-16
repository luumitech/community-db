import {
  toast as toastify,
  type Id,
  type ToastContent,
  type ToastOptions,
  type ToastPromiseParams,
  type UpdateOptions,
} from 'react-toastify';

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
    render: (arg) => {
      if (arg.data instanceof Error) {
        return arg.data.message;
      }
    },
  };

  const result = await toastify.promise(
    promise,
    {
      pending,
      error: error ?? customError,
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
