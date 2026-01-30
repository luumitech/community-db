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
                'rounded-medium px-3 py-2'
              )}
            >
              {label && (
                <label
                  className={cn(
                    'pointer-events-none z-10 cursor-text text-default-600',
                    'max-w-full truncate pe-2 pb-0.5 text-xs'
                  )}
                >
                  {label}
                </label>
              )}
              <ContentEditable
                className={cn(
                  'bg-clip-text text-small font-normal placeholder:text-foreground-500',
                  'focus-visible:outline-hidden'
                )}
                aria-placeholder={'Message Content'}
                placeholder={<div />}
              />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {description && (
          <div className="flex-col gap-1.5 p-1">
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
