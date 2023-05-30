// latexHint.ts
import { Completion, CompletionSource } from '@codemirror/autocomplete';

const latexCommands = [
  '\\begin',
  '\\end',
  '\\section',
  '\\subsection',
  '\\subsubsection',
  '\\textbf',
  '\\textit',
  '\\underline',
  '\\emph',
  '\\item',
  '\\frac',
  '\\sqrt',
  '\\sum',
  '\\int',
  '\\lim',
  '\\infty',
  '\\alpha',
  '\\beta',
  '\\gamma',
  '\\delta',
  '\\epsilon',
  '\\zeta',
];

export const latexHint = async (context) => {

  const { state, pos } = context;
  // 从状态中解析当前光标位置的 token
  const token = state.tree.resolve(pos, -1);

  if (!token) {
    return { from: pos, to: pos, options: [] };
  }

  const tokenText = state.sliceDoc(token.from, pos);
  const filteredCommands = latexCommands.filter((command) =>
    command.startsWith(tokenText)
  );

  const options = filteredCommands.map((command) => ({
    label: command,
    apply: command,
  }));

  // 补全结果
  return { from: token.from, to: pos, options };
};