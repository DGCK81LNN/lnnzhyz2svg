import { Character, CompiledText, Element } from "../types"

const syllableRegex =
  /^(-)?(\^)?(zh|ch|sh|[bpmfdtnlgkhjqxrzcs])?([iuy])?([ae])?([iunr]|ng)?([1-4])$/
const letteralRegex = /^(-)?(\^?)?([A-Z]|Zh|Ch|Sh|Er|[0-9]|X[a-f])$/

function getLetteral(lett: string): Element {
  if (lett === "Er") return { modifier: "er" }
  if (["I", "U", "Y"].includes(lett)) return { glide: lett.toLowerCase() }
  if (["A", "O", "E"].includes(lett)) return { vowel: lett.toLowerCase() }
  return { consonant: lett.toLowerCase() }
}

function compileSyllable(char: string) {
  const match = char.match(syllableRegex)
  if (!match) return

  const [, hyph, prop, init, glide, vowl, coda, tone] = match
  if (!init && !glide && !vowl && !coda) return

  const vowel = vowl || (coda && "e")

  const character: Character = {
    ...(hyph ? { hyphen: true } : null),
    ...(prop ? { proper: true } : null),
    main: { consonant: init || "" },
    pre: [] as Element[],
    post: [] as Element[],
    reverseAffixes: tone === "3" || tone === "4",
  }
  const affix = {
    ...(glide ? { glide } : null),
    ...(vowel ? { vowel } : null),
    ...(coda ? { coda } : null),
  }
  ;(tone === "2" || tone === "3" ? character.pre : character.post).push(affix)
  return character
}
function compileLetteral(char: string) {
  const match = char.match(letteralRegex)
  if (!match) return

  const [, hyph, prop, lett] = match
  return {
    ...(hyph ? { hyphen: true } : null),
    ...(prop ? { proper: true } : null),
    main: getLetteral(lett),
    pre: [],
    post: [],
  } as Character
}

/**
 * Compile Mandarin text into {@link CompiledText}.
 *
 * `input` should be the roman representation of a piece of valid LNNZHYZ,
 * following these additional rules:
 *
 *   * Separate characters in a word with underscores (`_`).
 *   * Separate words with spaces.
 *   * Hyphens can be used but punctuation is not allowed.
 *   * Prefix proper nouns with a caret (`^`).
 *   * Letterals should be capitalized.
 */
export function compileMandarin(input: string): CompiledText {
  const words = input.trim().split(/\s+/g)
  return words.map(word => {
    const characters = word.split(/_|(?=-)/g)
    return characters.map(char => {
      const character = compileSyllable(char) || compileLetteral(char)
      if (!character) throw new SyntaxError(`Invalid character ${char}`)
      return character
    })
  })
}
