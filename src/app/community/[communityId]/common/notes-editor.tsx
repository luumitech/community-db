import { Input, cn } from '@heroui/react';
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
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-end gap-2">
        <Input
          label="Notes"
          labelPlacement="outside"
          isClearable
          variant="bordered"
          value={line}
          onValueChange={setLine}
        />
        <Button
          variant="bordered"
          color="primary"
          isDisabled={!line.trim()}
          onPress={() => {
            setValue(
              controlName,
              [
                // prefix each message with `date(name):`
                `${formatAsDate(new Date())}(${shortName}): ${line.trim()}`,
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
      />
    </div>
  );
};
