import { Checkbox, cn } from '@heroui/react';
import React from 'react';
import { type Id } from 'react-toastify';
import * as GQL from '~/graphql/generated/graphql';
import { formatBytes } from '~/lib/number-util';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  toastHelper: ToastHelper;
}

/**
 * Renders the content within the import progress toast
 *
 * It shows:
 *
 * - Upload file progress (uploading to uploadthing)
 * - Import progress (updating database)
 */
const ImportProgress: React.FC<Props> = ({ className, toastHelper }) => {
  const { uploadComplete, importComplete, upload } = toastHelper;

  return (
    <div className={cn('flex flex-col')}>
      {toastHelper.method === GQL.ImportMethod.Xlsx && (
        <Checkbox
          // Want the cursor to remain as default, so added `isDisabled`
          // But don't want to make it appear disabled, so change opacity back to 100
          className="opacity-100"
          isReadOnly
          isDisabled
          isSelected={uploadComplete}
        >
          Uploaded {formatBytes(upload.loaded)} / {formatBytes(upload.size)}
        </Checkbox>
      )}
      <Checkbox
        // Want the cursor to remain as default, so added `isDisabled`
        // But don't want to make it appear disabled, so change opacity back to 100
        className="opacity-100"
        isReadOnly
        isDisabled
        isSelected={importComplete}
      >
        {importComplete ? 'Import Successfully' : 'Importing...'}
      </Checkbox>
    </div>
  );
};

interface UploadProgress {
  loaded: number;
  size: number;
}

interface ImportProgress {
  /** Progress from 0 - 1 */
  progress: number;
}

export class ToastHelper {
  private toastId: Id;
  public upload: UploadProgress;
  public import: ImportProgress;

  constructor(public method: GQL.ImportMethod) {
    this.upload = {
      loaded: 0,
      size: 0,
    };
    this.import = {
      progress: 0,
    };
    this.toastId = toast.loading('Importing (Please wait)...');
  }

  get uploadProgress() {
    const progress = this.upload.loaded / this.upload.size;
    return progress < 0 ? 0 : progress > 1 ? 1 : progress;
  }

  get uploadComplete() {
    return this.uploadProgress === 1;
  }

  get importProgress() {
    const progress = this.import.progress;
    return progress < 0 ? 0 : progress > 1 ? 1 : progress;
  }

  get importComplete() {
    return this.importProgress === 1;
  }

  private updateToast() {
    const totalProgress =
      this.method === GQL.ImportMethod.Xlsx
        ? (this.uploadProgress + this.importProgress) / 2
        : this.importProgress;

    toast.update(this.toastId, {
      render: <ImportProgress toastHelper={this} />,
      // toast autocloses when progress is 1, but we want to keep the toast
      // open, so assign 0.99
      progress: totalProgress < 1 ? totalProgress : 0.99,
      // Once operation completed, show close button
      ...(totalProgress >= 1 && {
        progress: undefined,
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
      }),
    });
  }

  /** Update the file uploading progress */
  updateUploadProgress(opt: UploadProgress) {
    // Makes sures loaded is never > size
    this.upload = {
      loaded: Math.min(opt.loaded, opt.size),
      size: opt.size,
    };
    this.updateToast();
  }

  /** Update the database import progress */
  updateImportProgress(opt: ImportProgress) {
    this.import = opt;
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
