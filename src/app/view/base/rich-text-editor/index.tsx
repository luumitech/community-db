import { EditorState, LexicalEditor } from 'lexical';
import React from 'react';
import {
  Controller,
  useFormContext,
  type Path,
} from '~/custom-hooks/hook-form';
import { CustomLexical, type CustomLexicalProps } from './custom-lexical';

export { MentionUtil } from './mention-util';

export interface RichTextEditorProps<TFieldValues> extends Omit<
  CustomLexicalProps,
  'onEditorInit'
> {
  controlName: Path<TFieldValues>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
  /** Triggered whenever content of editor is modified */
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
  isControlled,
  onEditorChange,
  ...props
}: RichTextEditorProps<TFieldValues>) {
  const { control } = useFormContext();

  const customOnValueChange = React.useCallback(
    (onChange: (value: string) => void) => {
      return (editorStateAsStr: string, editor: LexicalEditor) => {
        onChange(editorStateAsStr);
        const parsedEditorState = editor.parseEditorState(editorStateAsStr);
        onEditorChange?.(parsedEditorState, editor);
      };
    },
    [onEditorChange]
  );

  return (
    <Controller
      control={control}
      name={controlName}
      render={({ field, fieldState }) => {
        return (
          <CustomLexical
            {...(isControlled
              ? { value: field.value }
              : { defaultValue: field.value })}
            onValueChange={customOnValueChange(field.onChange)}
            /**
             * TODO: handle errorMessage,
             *
             * - But not priority now, because we don't expect this form value to
             *   cause errors
             */
            // errorMessage={fieldState.error?.message}
            // isInvalid={fieldState.invalid}
            {...props}
          />
        );
      }}
    />
  );
}
