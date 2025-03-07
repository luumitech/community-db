import { EditorState, LexicalEditor } from 'lexical';
import React from 'react';
import { useFormContext, type Path } from '~/custom-hooks/hook-form';
import { CustomLexical, type CustomLexicalProps } from './custom-lexical';

export { MentionUtil } from './mention-util';

interface Props<TFieldValues> extends Omit<CustomLexicalProps, 'onEditorInit'> {
  controlName: Path<TFieldValues>;
  onEditorChange?: (editorState: EditorState, editor: LexicalEditor) => void;
}

/**
 * A wrapper around CustomLexical that make use of react-hook-form controlName
 * to make the updates
 *
 * This component is ALWAYS uncontrolled
 */
export function RichTextEditor<TFieldValues>({
  controlName,
  onEditorChange,
  ...props
}: Props<TFieldValues>) {
  const { getValues, setValue } = useFormContext();
  const _editorState = getValues<string>(controlName);

  const onEditorInit = React.useCallback(
    (editor: LexicalEditor) => {
      const parsedEditorState = editor.parseEditorState(_editorState);
      editor.setEditorState(parsedEditorState);
    },
    [_editorState]
  );

  const customOnEditorChange = React.useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      onEditorChange?.(editorState, editor);
      const newEditorState = JSON.stringify(editorState.toJSON());
      setValue<string>(controlName, newEditorState, { shouldDirty: true });
    },
    [controlName, onEditorChange, setValue]
  );

  return (
    <CustomLexical
      onEditorInit={onEditorInit}
      onEditorChange={customOnEditorChange}
      {...props}
    />
  );
}
