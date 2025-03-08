import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { LineBreakNode, RootNode } from 'lexical';
import React from 'react';

export function SingleLinePlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
        if (rootNode.getChildrenSize() <= 1) {
          return;
        }
        rootNode.getLastChild()?.remove();
      }),
      editor.registerNodeTransform(LineBreakNode, (node) => {
        node.remove();
      })
    );
  }, [editor]);

  return null;
}
