import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { LineBreakNode, RootNode } from 'lexical';
import React from 'react';

interface Props {
  maxRows: number;
}

export const MaxRowsPlugin: React.FC<Props> = ({ maxRows }) => {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
        if (rootNode.getChildrenSize() <= maxRows) {
          return;
        }
        rootNode.getLastChild()?.remove();
      }),
      editor.registerNodeTransform(LineBreakNode, (node) => {
        node.remove();
      })
    );
  }, [editor, maxRows]);

  return null;
};
