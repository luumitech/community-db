import {
  $getRoot,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  RootNode,
  SerializedEditorState,
  TextNode,
  createEditor,
} from 'lexical';
import { BeautifulMentionNode } from 'lexical-beautiful-mentions';

/**
 * Utility for Mention related tools
 *
 * Mentions are used within a Rich Text Editor to substitute variable with a
 * given value This class requires that you define a mapping between a mention
 * variable name and its corresponding value
 */
export class MentionUtil {
  constructor(
    /**
     * Mapping between mention variable name and its value
     *
     * For example:
     *
     *     {
     *       "Membership Year": "2025"
     *     }
     */
    private mapping: Record<string, string>
  ) {}

  /**
   * Return mention items that can be used as trigger values in RichTextEditor.
   *
   * I.e.
   *
   *     {
   *       // Show mention items when '@' is entered in editor
   *       '@': mentionUtil.mentionItems(),
   *     }
   */
  mentionItems() {
    return Object.entries(this.mapping).map(([key, value]) => {
      return { value, varname: key };
    });
  }

  /**
   * Serialize editorState node to plain text
   *
   * - Handles substitutions correctly whenever mention node is encountered
   */
  toPlainText(serializedEditorState: string | SerializedEditorState) {
    const editor = createEditor({
      nodes: [BeautifulMentionNode],
    });
    const editorState = editor.parseEditorState(serializedEditorState);
    const text = editorState.read(() => {
      const rootNode = $getRoot();
      return this.lexicalNodeToPlainText(rootNode);
    });
    return text;
  }

  /**
   * Update each Mention node with the latest substitution text (given a
   * serialized EditorState)
   *
   * - This will also remove any mention node that we don't recognize
   */
  updateMentionInEditorState(
    serializedEditorState: string | SerializedEditorState
  ) {
    const editor = createEditor({
      nodes: [BeautifulMentionNode],
    });
    const editorState = editor.parseEditorState(serializedEditorState, () => {
      const rootNode = $getRoot();
      return this.lexicalNodeUpdateMention(rootNode);
    });
    return JSON.stringify(editorState.toJSON());
  }

  /**
   * Update each Mention node with the latest substitution text
   *
   * - This will also remove any mention node that we don't recognize
   */
  updateMention(editor: LexicalEditor) {
    editor.update(() => {
      const rootNode = $getRoot();
      return this.lexicalNodeUpdateMention(rootNode);
    });
  }

  /** Given a mention Node get the corresponding substitution value */
  private findMentionValue(node: BeautifulMentionNode) {
    const varname = node.getData()?.varname;
    if (!varname) {
      return null;
    }
    return this.mapping[varname as string] ?? null;
  }

  /** Resurse through all nodes, and update mention node with correct value */
  private lexicalNodeUpdateMention(node: LexicalNode) {
    if (node instanceof RootNode || node instanceof ParagraphNode) {
      const children = node.getChildren();
      children.forEach((child) => this.lexicalNodeUpdateMention(child));
    } else if (node instanceof BeautifulMentionNode) {
      const subValue = this.findMentionValue(node);
      if (subValue) {
        if (subValue !== node.getValue()) {
          node.setValue(subValue);
        }
      } else {
        node.remove();
      }
    }
  }

  /** Resurse through all nodes, and return text content */
  private lexicalNodeToPlainText(node: LexicalNode) {
    let textContent = '';

    if (node instanceof RootNode) {
      const children = node.getChildren();
      textContent += children
        .map((child) => this.lexicalNodeToPlainText(child))
        .join('');
    } else if (node instanceof ParagraphNode) {
      const children = node.getChildren();
      textContent += children
        .map((child) => this.lexicalNodeToPlainText(child))
        .join('');
      textContent += '\n';
    } else if (node instanceof BeautifulMentionNode) {
      // Only keep the text value, not the trigger character
      const subValue = this.findMentionValue(node);
      if (subValue) {
        textContent += subValue;
      }
    } else if (node instanceof TextNode) {
      textContent += node.getTextContent();
    }

    return textContent;
  }
}
