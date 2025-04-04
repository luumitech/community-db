import { cn } from '@heroui/react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState, LexicalEditor } from 'lexical';
import {
  BeautifulMentionNode,
  BeautifulMentionsItem,
  BeautifulMentionsPlugin,
  BeautifulMentionsTheme,
} from 'lexical-beautiful-mentions';
import React from 'react';
import { CustomMenu, CustomMenuItem } from './custom-menu';
import { MaxRowsPlugin } from './max-rows-plugin';

export interface CustomLexicalProps {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  mentionTheme?: BeautifulMentionsTheme;
  mentionItems?: Record<string, BeautifulMentionsItem[]>;
  onEditorInit?: (editor: LexicalEditor) => void;
  onEditorChange?: (editorState: EditorState, editor: LexicalEditor) => void;
  /** Maximum number of rows (newline characters) allowed in editor */
  maxRows?: number;
}

export const CustomLexical: React.FC<CustomLexicalProps> = ({
  className,
  label,
  description,
  mentionTheme,
  mentionItems,
  onEditorInit,
  onEditorChange,
  maxRows,
}) => {
  const initialConfig = {
    namespace: 'editor',
    theme: {
      beautifulMentions: mentionTheme,
    },
    nodes: [BeautifulMentionNode],
    onError: (error: Error) => {
      /**
       * Catch any errors that occur during Lexical updates and log them or
       * throw them as needed. If you don't throw them, Lexical will try to
       * recover gracefully without losing user data.
       */
      console.error({ error });
    },
    editorState: (editor: LexicalEditor) => {
      onEditorInit?.(editor);
    },
  };

  const onChange = React.useCallback(
    (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      onEditorChange?.(editorState, editor);
    },
    [onEditorChange]
  );

  return (
    <div className={className}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <div
              className={cn(
                'border-medium border-default-200 hover:border-default-400',
                'focus-within:border-default-foreground',
                'px-3 py-2 rounded-medium'
              )}
            >
              {label && (
                <label
                  className={cn(
                    'z-10 pointer-events-none text-default-600 cursor-text',
                    'text-xs pb-0.5 pe-2 max-w-full text-ellipsis overflow-hidden'
                  )}
                >
                  {label}
                </label>
              )}
              <ContentEditable
                className={cn(
                  'font-normal placeholder:text-foreground-500 bg-clip-text text-small',
                  'focus-visible:outline-none'
                )}
                aria-placeholder={'Message Content'}
                placeholder={<div />}
              />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {description && (
          <div className="p-1 flex-col gap-1.5">
            <div className="text-tiny text-foreground-400">{description}</div>
          </div>
        )}
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
        {mentionItems && (
          <BeautifulMentionsPlugin
            items={mentionItems}
            menuComponent={CustomMenu}
            menuItemComponent={CustomMenuItem}
            autoSpace={false}
          />
        )}
        {maxRows != null && <MaxRowsPlugin maxRows={maxRows} />}
      </LexicalComposer>
    </div>
  );
};
