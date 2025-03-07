import { EditorState, LexicalEditor } from 'lexical';
import { BeautifulMentionsItem } from 'lexical-beautiful-mentions';
import React from 'react';
import { type Path } from '~/custom-hooks/hook-form';
import { MentionUtil, RichTextEditor } from '~/view/base/rich-text-editor';
import * as editorUtil from './editor-util';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props {
  className?: string;
  controlName: Path<InputData>;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const TextEditor: React.FC<Props> = ({
  className,
  controlName,
  label,
  description,
}) => {
  const { getValues, watch } = useHookFormContext();
  const membershipYear = getValues('hidden.membershipYear');
  const toItems = getValues('hidden.toItems');
  const toEmail = watch('hidden.toEmail');

  /**
   * Construct the substitution text for member names
   *
   * I.e firstName1, firstName2
   */
  const mentionUtil = React.useMemo(() => {
    const mentionMapping = editorUtil.createMentionMapping(
      membershipYear,
      toItems,
      toEmail
    );
    return new MentionUtil(mentionMapping);
  }, [membershipYear, toItems, toEmail]);

  const mentionItems = React.useMemo<Record<string, BeautifulMentionsItem[]>>(
    () => ({
      '@': mentionUtil.mentionItems(),
    }),
    [mentionUtil]
  );

  const onEditorChange = React.useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      mentionUtil.updateMention(editor);
    },
    [mentionUtil]
  );

  return (
    <RichTextEditor<InputData>
      className={className}
      controlName={controlName}
      label={label}
      description={description}
      mentionTheme={editorUtil.theme}
      mentionItems={mentionItems}
      onEditorChange={onEditorChange}
    />
  );
};
