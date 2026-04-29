import { Chip, cn } from '@heroui/react';
import { produce } from 'immer';
import React from 'react';
import { MentionUtil } from '~/view/base/rich-text-editor';
import {
  PlainSelect,
  SelectItem,
  type PlainSelectProps,
} from '~/view/base/select';
import { createMentionMapping, createMentionValues } from './editor-util';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ToSelect: React.FC<Props> = ({ className }) => {
  const { getValues, setValue, formState, watch, reset } = useHookFormContext();
  const controlName = 'hidden.toEmail' as const;
  const toEmail = getValues(controlName);
  const membershipYear = getValues('hidden.membershipYear');
  const toItems = getValues('hidden.toItems');
  const subject = watch('defaultSetting.membershipEmail.subject');
  const message = watch('defaultSetting.membershipEmail.message');
  const { errors, isDirty } = formState;
  const errMsg = errors.hidden?.toEmail?.message;

  const items = React.useMemo<SelectItem[]>(() => {
    return toItems.map((item) => ({
      key: item.email,
      textValue: item.fullName,
      rendered: (
        <div className="flex flex-col">
          <span className="text-sm">{item.fullName}</span>
          <span className="text-xs text-foreground/60">{item.email}</span>
        </div>
      ),
    }));
  }, [toItems]);

  const onSelectionChange: NonNullable<PlainSelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        const newToEmail = [...keys].join(',');
        // NOT setting dirty bit because changing the To List only updates the
        // mention values, and won't actually affect the Email Template
        setValue(controlName, newToEmail);

        // Since mentionValues have changed, we need to update the EditorState approriately
        const mentionValues = createMentionValues(
          membershipYear,
          toItems,
          newToEmail
        );
        const mentionUtil = new MentionUtil(
          createMentionMapping(mentionValues)
        );
        const newSubject = mentionUtil.updateMentionInEditorState(subject);
        const newMessage = mentionUtil.updateMentionInEditorState(message);
        if (!isDirty) {
          // When the form is clean, we want to make sure that the rich text
          // editor do not flag its content as changed due to the change in the
          // mention value, so we reset the message EditorState to match the new values
          reset((defaultValues) => {
            return produce(defaultValues, (draft) => {
              draft.defaultSetting.membershipEmail.subject = newSubject;
              draft.defaultSetting.membershipEmail.message = newMessage;
            });
          });
        } else {
          // Again don't need to set the dirty bit (the dirty state should be on anyways)
          setValue('defaultSetting.membershipEmail.subject', newSubject);
          setValue('defaultSetting.membershipEmail.message', newMessage);
        }
      },
      [isDirty, membershipYear, message, reset, setValue, subject, toItems]
    );

  const renderValue = React.useCallback((selectedItems: SelectItem[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <Chip key={item.key} size="sm">
            {item.textValue}
          </Chip>
        ))}
      </div>
    );
  }, []);

  return (
    <PlainSelect
      className={cn(className)}
      placeholder="Select at least one recipient"
      fullWidth
      isMultiline={true}
      label="To"
      variant="bordered"
      items={items}
      renderValue={renderValue}
      selectionMode="multiple"
      disallowEmptySelection
      errorMessage={errMsg}
      isInvalid={!!errMsg}
      defaultSelectedKeys={toEmail.split(',')}
      onSelectionChange={onSelectionChange}
    />
  );
};
