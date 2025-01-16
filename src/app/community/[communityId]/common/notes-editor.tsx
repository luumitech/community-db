import { Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import { useUserInfo } from '~/custom-hooks/user-info';
import { formatAsDate } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Textarea } from '~/view/base/textarea';

interface Props {
  className?: string;
  controlName: string;
}

export const NotesEditor: React.FC<Props> = ({ className, controlName }) => {
  const { shortName } = useUserInfo();
  const [line, setLine] = React.useState<string>('');
  const { setValue, watch } = useFormContext();
  const notes = watch(controlName);

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <div className="flex items-end gap-2">
        <Input
          label="Notes"
          labelPlacement="outside"
          placeholder="Enter notes"
          isClearable
          value={line}
          onValueChange={setLine}
        />
        <Button
          variant="bordered"
          color="primary"
          onPress={() => {
            setValue(
              controlName,
              [
                shortName,
                // prefix each message with date
                `${formatAsDate(new Date())}: ${line}\n`,
                notes,
              ].join('\n'),
              { shouldDirty: true }
            );
            setLine('');
          }}
        >
          Add
        </Button>
      </div>
      <Textarea
        className={className}
        controlName={controlName}
        isControlled
        variant="bordered"
        aria-label="Notes"
        placeholder="Enter notes"
      />
    </div>
  );
};
