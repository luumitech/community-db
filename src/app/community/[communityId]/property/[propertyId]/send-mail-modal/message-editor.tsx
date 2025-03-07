import { EditorState, LexicalEditor } from 'lexical';
import {
  BeautifulMentionsCssClassNames,
  BeautifulMentionsItem,
  BeautifulMentionsTheme,
} from 'lexical-beautiful-mentions';
import React from 'react';
import { MentionUtil, RichTextEditor } from './rich-text-editor';
import { InputData, useHookFormContext } from './use-hook-form';

/**
 * Construct mention mapping, which contains mapping between menu item that
 * appear in the mention menu, along with its corresponding substitution value
 */
export function createMentionMapping(
  membershipYear: string,
  toItems: InputData['hidden']['toItems'],
  toEmail: string
) {
  const toEmailList = toEmail.split(',');
  const toList = toItems.filter(({ email }) => toEmailList.includes(email));
  const memberNames = toList.map(({ firstName }) => firstName).join(', ');
  return {
    ['Member Names']: memberNames,
    ['Membership Year']: membershipYear,
  };
}

const mentionClass: BeautifulMentionsCssClassNames = {
  trigger: 'hidden',
  value: 'text-secondary-600',
  container: 'bg-secondary/20 rounded-full h-7 px-1',
  containerFocused: '',
};
const theme: BeautifulMentionsTheme = {
  '@': mentionClass,
};

interface Props {
  className?: string;
  label?: string;
}

export const MessageEditor: React.FC<Props> = ({ className, label }) => {
  const { getValues, setValue, watch } = useHookFormContext();
  const messageEditorState = getValues('messageEditorState');
  const membershipYear = getValues('hidden.membershipYear');
  const toEmail = watch('toEmail');
  const toItems = watch('hidden.toItems');

  /**
   * Construct the substitution text for member names
   *
   * I.e firstName1, firstName2
   */
  const mentionMapping = React.useMemo(() => {
    return createMentionMapping(membershipYear, toItems, toEmail);
  }, [membershipYear, toItems, toEmail]);

  const mentionUtil = React.useMemo(() => {
    return new MentionUtil(mentionMapping);
  }, [mentionMapping]);

  const mentionItems = React.useMemo<Record<string, BeautifulMentionsItem[]>>(
    () => ({
      '@': mentionUtil.mentionItems(),
    }),
    [mentionUtil]
  );

  const onEditorInit = React.useCallback(
    (editor: LexicalEditor) => {
      const parsedEditorState = editor.parseEditorState(messageEditorState);
      editor.setEditorState(parsedEditorState);
    },
    [messageEditorState]
  );

  const onEditorChange = React.useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      mentionUtil.updateMention(editor);
      const newEditorState = JSON.stringify(editorState.toJSON());
      setValue('messageEditorState', newEditorState, { shouldDirty: true });
    },
    [setValue, mentionUtil]
  );

  return (
    <RichTextEditor
      className={className}
      label="Message"
      description={
        <div>
          Type{' '}
          <span className={mentionClass.container}>
            <span className={mentionClass.value}>@</span>
          </span>{' '}
          to insert template values
        </div>
      }
      mentionTheme={theme}
      mentionItems={mentionItems}
      onEditorInit={onEditorInit}
      onEditorChange={onEditorChange}
    />
  );
};
