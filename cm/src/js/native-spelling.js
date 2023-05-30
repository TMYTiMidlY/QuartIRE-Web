import { ViewPlugin, Decoration } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

export default () => {
  return ViewPlugin.define(
    () => {
      const value = {
        decorations: Decoration.none,
        update(update) {
          if (shouldRecalculate(update)) {
            value.decorations = buildDecorations(update.view)
          }
        },
      }

      return value
    },
    {
      decorations: (value) => value.decorations,
    }
  )
}

const shouldRecalculate = (update) =>
  update.docChanged || update.viewportChanged

const spellcheckDisabledMark = Decoration.mark({
  attributes: { spellcheck: false },
})

const typesWithoutSpellcheck = ['typeName', 'atom']

const buildDecorations = (view) => {
  const decorations = []

  const tree = syntaxTree(view.state)

  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter: (type, from, to) => {
        if (typesWithoutSpellcheck.includes(type.name)) {
          decorations.push(spellcheckDisabledMark.range(from, to))
        }
      },
    })
  }

  return Decoration.set(decorations)
}
