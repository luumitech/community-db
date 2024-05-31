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
 * @returns
 */
function toastPromise<TData = unknown, TError = unknown, TPending = unknown>(
  promise: Promise<TData> | (() => Promise<TData>),
  { pending, error, success }: ToastPromiseParams<TData, TError, TPending>,
  options?: ToastOptions<TData>
): Promise<TData> {
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

  return toastify.promise(
    promise,
    {
      pending,
      error: error ?? customError,
      success,
    },
    options
  );
}

/**
 * Customize toast.error:
 * - should not automatically dismiss
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
 * customize react-toastify toast object
 * - toast.promise will display error message automatically
 */
export const toast = {
  ...toastify,
  promise: toastPromise,
  error: toastError,
};
