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
  /** Set auto focus on the one line input */
  autoFocus?: boolean;
}

export const NotesEditor: React.FC<Props> = ({
  className,
  controlName,
  autoFocus,
}) => {
  const { shortName } = useUserInfo();
  const [line, setLine] = React.useState<string>('');
  const { setValue, watch } = useFormContext();
  const notes = watch(controlName);

  const notePrefix = React.useMemo(() => {
    // prefix each message with `date(name):`
    return `${formatAsDate(new Date())}(${shortName}):`;
  }, [shortName]);

  const onAddNote = React.useCallback(() => {
    const noteContent = line.trim();
    if (noteContent) {
      setValue(
        controlName,
        [
          // prefix each message with `date(name):`
          `${notePrefix} ${line.trim()}`,
          notes,
        ].join('\n'),
        { shouldDirty: true }
      );
      setLine('');
    }
  }, [controlName, line, notePrefix, notes, setValue]);

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-end gap-2">
        <Input
          label="Notes"
          labelPlacement="outside"
          variant="bordered"
          isClearable
          autoFocus={autoFocus}
          value={line}
          startContent={
            <span className="pointer-events-none text-xs text-nowrap text-default-400">
              {notePrefix}
            </span>
          }
          onValueChange={setLine}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              onAddNote();
              evt.preventDefault();
            }
          }}
        />
        <Button
          variant="bordered"
          color="primary"
          isDisabled={!line.trim()}
          onPress={onAddNote}
        >
          Enter
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
