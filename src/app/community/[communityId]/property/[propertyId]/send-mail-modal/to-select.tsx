import { Chip, Select, SelectItem, SelectProps, cn } from '@heroui/react';
import { produce } from 'immer';
import React from 'react';
import { MentionUtil } from '~/view/base/rich-text-editor';
import { createMentionMapping } from './editor-util';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ToSelect: React.FC<Props> = ({ className }) => {
  const { getValues, setValue, formState, reset } = useHookFormContext();
  const controlName = 'hidden.toEmail' as const;
  const toEmail = getValues(controlName);
  const membershipYear = getValues('hidden.membershipYear');
  const toItems = getValues('hidden.toItems');
  const { errors, isDirty } = formState;
  const errMsg = errors.hidden?.toEmail?.message;

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        const newToEmail = [...keys].join(',');
        // Not setting dirty bit because changing the To List only updates the
        // mention values, and won't actually affect the Email Template
        setValue(controlName, newToEmail);
        if (!isDirty) {
          // When the form is clean, we want to make sure that the rich text
          // editor do not flag its content as changed due to the change in the
          // mention text, so we reset the message EditorState with the new
          // mention value.
          const mentionUtil = new MentionUtil(
            createMentionMapping(membershipYear, toItems, newToEmail)
          );
          reset((defaultValues) => {
            return produce(defaultValues, (draft) => {
              const { membershipEmail } = draft.defaultSetting;
              draft.defaultSetting.membershipEmail.message =
                mentionUtil.updateMentionInEditorState(membershipEmail.message);
              draft.defaultSetting.membershipEmail.subject =
                mentionUtil.updateMentionInEditorState(membershipEmail.subject);
            });
          });
        }
      },
      [isDirty, membershipYear, reset, setValue, toItems]
    );

  return (
    <Select
      className={cn(className)}
      placeholder="Select at least one recipient"
      fullWidth
      isMultiline={true}
      label="To"
      variant="bordered"
      items={toItems}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key} size="sm">
                {item.data?.fullName}
              </Chip>
            ))}
          </div>
        );
      }}
      selectionMode="multiple"
      disallowEmptySelection
      errorMessage={errMsg}
      isInvalid={!!errMsg}
      defaultSelectedKeys={toEmail.split(',')}
      onSelectionChange={onSelectionChange}
    >
      {(user) => (
        <SelectItem key={user.email} textValue={user.fullName}>
          <div className="flex flex-col">
            <span className="text-small">{user.fullName}</span>
            <span className="text-tiny text-default-400">{user.email}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
