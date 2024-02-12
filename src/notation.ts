import { hasOwnProp } from "./utils"
import data from "./data.json"
import { Character, CompiledText, Element } from "./types"

/**
 * @file Serialization notation.
 *
 * These functions do not check whether the input is valid and should only be
 * expected to work properly on valid text. For example, the first element of
 * `post`, if present, must be a final. `[[{ main: { consonant: "n" }, post: [{
 * consonant: "j" }] }]]` serializes as `"nj"`, which then deserializes as `[[{
 * main: { consonant: "nj" } }]]` instead.
 */

const sli = JSON.stringify

export function serializeElement(el: Element) {
  if ("consonant" in el) return el.consonant || "w"
  if ("modifier" in el) return el.modifier
  return (
    ((el.glide || "") + (el.vowel || "") + (el.coda || "") || "ih") +
    (el.reversed ? "~" : "")
  )
}

export function serializeText(text: CompiledText) {
  return text
    .map(word =>
      word
        .map(
          char =>
            (char.hyphen ? "-" : "") +
            (char.proper ? "^" : "") +
            (
              [...char.pre, char.main].map(serializeElement).join("+") +
              char.post.map(serializeElement).join("+")
            ).replace(/~\+/g, "~")
        )
        .join("_")
        .replace(/_-/g, "-")
    )
    .join(" ")
}

const initialRe = new RegExp(
  `^(?:w|${Object.keys(data.consonants)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .join("|")})`
)
const finalRe = new RegExp(
  `^(${Object.keys(data.glides).join("|")})?` +
    `(?:(${Object.keys(data.vowels).join("|")})` +
    `(${Object.keys(data.codas).join("|")})?)?(?<=.)(~?)$`
)

export function deserializeElement(s: string): Element {
  if (!s) throw new SyntaxError("Empty element")
  if (s === "w") return { consonant: "" }
  if (s === "ih") return {}
  if (s === "ih~") return { reversed: true }
  if (hasOwnProp(data.consonants, s)) return { consonant: s }
  if (hasOwnProp(data.modifiers, s)) return { modifier: s }

  const match = finalRe.exec(s)
  if (!match) throw new SyntaxError(`Invalid element: ${sli(s)}`)
  const el: Element = {}
  const [, glid, vowl, coda, rev] = match
  if (glid) el.glide = glid
  if (vowl) el.vowel = vowl
  if (coda) el.coda = coda
  if (rev) el.reversed = true
  return el
}

export function deserializeText(s: string): CompiledText {
  return s.split(" ").map(ws =>
    ws.split(/_|(?=-)/).map(cs => {
      let main: Element | null = null
      const pre: Element[] = []
      const post: Element[] = []
      const char: Partial<Character> = {}

      if (cs[0] === "-") {
        char.hyphen = true
        cs = cs.slice(1)
      }
      if (cs[0] === "^") {
        char.proper = true
        cs = cs.slice(1)
      }

      for (const es of cs.split(/\+|(?<=~)/)) {
        const initial = initialRe.exec(es)?.[0]
        if (initial) {
          const final = es.slice(initial.length)
          if (final) {
            if (main)
              throw new SyntaxError(
                `Unexpected main-post element ${sli(es)} in char ${sli(cs)}`
              )
            main = deserializeElement(initial)
            post.push(deserializeElement(final))
            continue
          }
        }

        ;(main ? post : pre).push(deserializeElement(es))
      }

      if (!main) {
        main = pre.pop()
        if (!main)
          throw new SyntaxError(`No main element found in char ${sli(cs)}`)
      }

      return { ...char, main, pre, post } as Character
    })
  )
}
