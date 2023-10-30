import { Element } from "../types"
import { getOwnProp } from "../utils"
import { compileGeneral } from "./general"

const charcterRegex =
  /^([1-8ABDEFHLNTVYa-z]*)([457BDFHNbcdfghj-np-tv-z])(i(?![1E])|u(?![1A])|)([12368AELTVYaeo])([1-8ABD-FHLNTVYa-z]*)$/
const vowellessRegex =
  /^([1-8ABDEFHLNTVYa-z]*)([457BDFHNbcdfghj-np-tv-z])([iu])()([1-8ABD-FHLNTVYa-z]*)$/
const letterRegex = /^()([1-8ABDEFHLNTVYa-z]|X[0-9a-f])()()()$/

const consonantMapping: Record<string, string> = {
  "w": "v",
  "y": "yj",
  "n": "nj",
  "D": "c",
  "H": "nz",
  "N": "ng",
  "l": "n",
  "4": "",
  "5": "ngw",
  "v": "nw",
  "F": "dw",
  "7": "tw",
  "B": "gw",
  "c": "kw",
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
  "E": { vowel: "ii" },
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

for (let i = 0; i < 16; i++) {
  const h = i.toString(16)
  mapping[`X${h}`] = { consonant: i < 10 ? `${i}` : `x${h}` }
}

function compileFinal(glid: string, vowl: string): Element[] {
  if (!glid && !vowl) return []
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
export function compileShidinn(input: string) {
  return compileGeneral(input, char => {
    const match = char.match(charcterRegex) || char.match(vowellessRegex) || char.match(letterRegex)
    if (!match) throw new SyntaxError(`Invalid Shidinn character ${char}`)

    const [, pre, init, glid, vowl, post] = match

    return {
      pre: compileRadicalLetters(pre),
      main: getOwnProp(mapping, init),
      post: compileFinal(glid, vowl).concat(compileRadicalLetters(post)),
    }
  })
}
