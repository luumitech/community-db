import { Checkbox, cn } from '@heroui/react';
import React from 'react';
import { type Id } from 'react-toastify';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  toastHelper: ToastHelper;
}

/**
 * Renders the content within the modify progress toast
 *
 * It shows:
 *
 * - Modify progress
 */
const BatchPropertyModifyProgress: React.FC<Props> = ({
  className,
  toastHelper,
}) => {
  const { progress, complete } = toastHelper;

  return (
    <div className={cn('flex flex-col')}>
      <Checkbox
        // Want the cursor to remain as default, so added `isDisabled`
        // But don't want to make it appear disabled, so change opacity back to 100
        className="opacity-100"
        isReadOnly
        isDisabled
        isSelected={complete}
      >
        {complete ? 'Saved Successfully' : 'Saving (Please wait)...'}
      </Checkbox>
    </div>
  );
};

export class ToastHelper {
  private toastId: Id;
  /** Progress from 0 - 1 */
  private _progress: number;

  constructor() {
    this._progress = 0;
    this.toastId = toast.loading('Saving (Please wait)...');
  }

  get progress() {
    const progress = this._progress;
    return progress < 0 ? 0 : progress > 1 ? 1 : progress;
  }

  get complete() {
    return this.progress === 1;
  }

  private updateToast() {
    toast.update(this.toastId, {
      render: <BatchPropertyModifyProgress toastHelper={this} />,
      // toast autocloses when progress is 1, but we want to keep the toast
      // open, so assign 0.99
      progress: this._progress < 1 ? this._progress : 0.99,
      // Once operation completed, show close button
      ...(this._progress >= 1 && {
        progress: undefined,
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
      }),
    });
  }

  /** Update the database import progress */
  updateProgress(progress: number) {
    this._progress = progress;
    this.updateToast();
  }

  /** Display an error toast */
  updateError(errMsg: React.ReactNode) {
    toast.update(this.toastId, {
      type: 'error',
      render: errMsg,
      progress: undefined,
      isLoading: false,
      closeButton: true,
    });
  }
}
