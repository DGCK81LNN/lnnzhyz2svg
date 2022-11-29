import { Element, Character, CompiledText } from "../types"
import { getOwnProp } from "../utils"

const charcterRegex =
  /^(-)?(\^)?([1-8ABDEFHLNTVYa-z]*?)([457BDFHNbcdfghj-np-tv-z])([iu]?)([12368AELTVYaeo])([1-8ABD-FHLNTVYa-z]*)$/
const letterRegex = /^(-)?(\^)?()([1-8ABDEFHLNTVYa-z])()()()$/

const consonantMapping: Record<string, string> = {
  "w": "f",
  "n": "nj",
  "D": "c",
  "H": "nz",
  "N": "ng",
  "4": "",
  "5": "ngw",
  "v": "lw",
  "F": "dw",
  "7": "tw",
  "B": "gw",
  "c": "kw",
  "f": "fw",
}
const mapping: Record<string, Element> = {
  ...Object.fromEntries(
    [..."bpmwjqxynzDsrHNldtgkh45vF7Bcf"].map(ltr => [
      ltr,
      {
        consonant: getOwnProp(consonantMapping, ltr, ltr),
      },
    ])
  ),
  "u": { glide: "u" },
  "a": { vowel: "a" },
  "o": { vowel: "oo" },
  "e": { vowel: "e" },
  "E": { vowel: "ee" },
  "A": { vowel: "uu" },
  "Y": { vowel: "a", coda: "i" },
  "L": { vowel: "a", coda: "u" },
  "6": { vowel: "e", coda: "u" },
  "2": { vowel: "a", coda: "n" },
  "T": { vowel: "a", coda: "ng" },
  "8": { vowel: "e", coda: "ng" },
  "3": { vowel: "e", coda: "n" },
  "V": { vowel: "e", coda: "i" },
  "1": {},
  "i": { glide: "i" },
}

function compileFinal(glid: string, vowl: string): Element[] {
  if (!vowl) return []
  return [
    {
      ...getOwnProp(mapping, vowl),
      ...(glid ? { glide: glid as "i" | "u" } : null),
    },
  ]
}
function compileRadicalLetters(elements: string): Element[] {
  return [...elements].map(add => getOwnProp(mapping, add))
}

/**
 * Compile Shidinn text into {@link CompiledText}.
 *
 * `input` should be in Shidinn Chat Alphabet, following these additional rules:
 *
 *   * Separate characters in a word with underscores (`_`).
 *   * Separate words with spaces.
 *   * Hyphens can be used but punctuation is not allowed.
 *   * Prefix proper nouns with a caret (`^`).
 */
export function compileShidinn(input: string): CompiledText {
  const words = input.trim().split(/\s+/g)
  return words.map(word => {
    const characters = word.split(/_|(?=-)/g)
    return characters.map(char => {
      const match = char.match(charcterRegex) || char.match(letterRegex)
      if (!match) throw new SyntaxError(`Invalid Shidinn character ${char}`)

      const [, hyph, prop, pre, init, glid, vowl, post] = match

      return {
        ...(hyph ? { hyphen: true } : null),
        ...(prop ? { proper: true } : null),
        pre: compileRadicalLetters(pre),
        main: getOwnProp(mapping, init),
        post: compileFinal(glid, vowl).concat(compileRadicalLetters(post)),
      } as Character
    })
  })
}
