import { EditorView } from "codemirror";
import { Decoration } from "@codemirror/view";
import { EditorState, StateField } from "@codemirror/state";

/**
 * Plugin that makes line wrapping in the editor respect the indentation of the line.
 * It does this by adding a line decoration that adds margin-left (as much as there is indentation),
 * and adds the same amount as negative "text-indent". The nice thing about text-indent is that it
 * applies to the initial line of a wrapped line.
 *
 * @author qbane, et al.
 * @see https://discuss.codemirror.net/t/making-codemirror-6-respect-indent-for-wrapped-lines/2881/9
 */
export const indentWrap = StateField.define({
  create: (state) => getDecorations(state),
  update(deco, tr) {
    if (!tr.docChanged) return deco;
    return getDecorations(tr.state);
  },
  provide: (f) => EditorView.decorations.from(f),
});

function getDecorations(state: EditorState) {
  const decorations = [];

  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    const leadingSpace = /^ */.exec(line.text)?.[0] ?? "";
    const offset = leadingSpace.length + state.tabSize;

    const linerwapper = Decoration.line({
      attributes: {
        style: `--indented: ${offset}ch;`,
        class: "indented-wrapped-line",
      },
    });

    decorations.push(linerwapper.range(line.from, line.from));
  }

  return Decoration.set(decorations);
}

export const indentWrapTheme = EditorView.theme({
  ".indented-wrapped-line": {
    borderLeft: "transparent solid calc(var(--indented))",
  },
  ".indented-wrapped-line:before": {
    content: '""',
    marginLeft: "calc(-1 * var(--indented))",
  },
});

export const indentWrapExtensions = [
  EditorView.lineWrapping,
  indentWrap,
  indentWrapTheme,
];
