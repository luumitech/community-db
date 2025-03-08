import { EditorState, LexicalEditor } from 'lexical';
import { BeautifulMentionsItem } from 'lexical-beautiful-mentions';
import React from 'react';
import {
  MentionUtil,
  RichTextEditor,
  type RichTextEditorProps,
} from '~/view/base/rich-text-editor';
import * as editorUtil from './editor-util';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props extends RichTextEditorProps<InputData> {}

export const TextEditor: React.FC<Props> = (props) => {
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
    const mentionValues = editorUtil.createMentionValues(
      membershipYear,
      toItems,
      toEmail
    );
    const mentionMapping = editorUtil.createMentionMapping(mentionValues);
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
      mentionTheme={editorUtil.theme}
      mentionItems={mentionItems}
      onEditorChange={onEditorChange}
      {...props}
    />
  );
};
