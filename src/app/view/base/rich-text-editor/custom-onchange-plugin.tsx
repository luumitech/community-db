import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import React from 'react';

interface Props {
  value?: string;
  onValueChange?: (editorStateAsStr: string, editor: LexicalEditor) => void;
}

/**
 * A custom OnChange plugin that would makes the Editor into a controlled input
 *
 * - Updates the editor content whenever value differs from editor state
 */
export const CustomOnChangePlugin: React.FC<Props> = ({
  value,
  onValueChange,
}) => {
  const [editor] = useLexicalComposerContext();
  /**
   * Keeps track of the current editor state, we compare this with `value` to
   * decide if it is necessary to forcefully update the editor with the latest
   * `value`
   */
  const currentEditorState = React.useRef<string>(null);

  React.useEffect(() => {
    if (value === currentEditorState.current) {
      return;
    }

    // Update editor with the latest editorState value
    try {
      if (value) {
        const parsedState = editor.parseEditorState(value);
        queueMicrotask(() => {
          editor.setEditorState(parsedState);
        });
      }
    } catch (e) {
      console.error('Failed to parse incoming Lexical EditorState', e);
    }
  }, [value, editor, onValueChange]);

  const onChange = React.useCallback(
    (editorState: EditorState, _editor: LexicalEditor, tags: Set<string>) => {
      const editorStateAsStr = JSON.stringify(editorState.toJSON());
      if (editorStateAsStr !== currentEditorState.current) {
        currentEditorState.current = editorStateAsStr;
      }
      onValueChange?.(editorStateAsStr, _editor);
    },
    [onValueChange]
  );

  return <OnChangePlugin onChange={onChange} />;
};
