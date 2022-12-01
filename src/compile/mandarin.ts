import { Character, Element } from "../types"
import { compileGeneral } from "./general"

const syllableRegex =
  /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcs])?([iuy]|iu)?([aeo])?([iunr]|ng)?([1-4])$/
const ngRegex = /^(ng)()()()([1-4])$/
const ehRegex = /^()()(eh)()([1-4])$/
const letteralRegex = /^([A-Z]|Zh|Ch|Sh|Er|[0-9]|X[a-f])$/

function getLetteral(lett: string): Element {
  if (lett === "Er") return { modifier: "er" }
  if (["I", "U", "Y"].includes(lett)) return { glide: lett.toLowerCase() }
  if (["A", "O", "E"].includes(lett)) return { vowel: lett.toLowerCase() }
  return { consonant: lett.toLowerCase() }
}

function compileSyllable(char: string): Character {
  if (char === "hm" || char === "hng")
    return {
      main: { consonant: "h" },
      pre: [],
      post: [{ consonant: char === "hm" ? "m" : "" }],
    }

  const match =
    char.match(ngRegex) || char.match(syllableRegex) || char.match(ehRegex)
  if (!match) return

  let [, init, glide, vowel, coda, tone] = match
  if (!init && !glide && !vowel && !coda) return

  if (init === "ng") init = ""
  if (coda && !vowel) vowel = "e"
  if (glide === "iu") glide = "y"
  if (vowel === "o") {
    if (coda === "u") {
      vowel = "e"
    } else if (init || glide) {
      glide = glide === "i" ? "y" : "u"
      vowel = "e"
    }
  }

  const character: Character = {
    main: { consonant: init || "" },
    pre: [],
    post: [],
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

  const [, lett] = match
  return {
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
export function compileMandarin(input: string) {
  return compileGeneral(input, compileSyllable, compileLetteral)
}
