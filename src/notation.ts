import { hasOwnProp } from "./utils"
import data from "./data.json"
import { Character, CompiledText, Element } from "./types"

/**
 * @file Serialization notation.
 *
 * These functions do not check whether the input is valid and should only be
 * expected to work properly on valid text.
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
        .map(char => {
          let cs = ""
          if (char.hyphen) cs += "-"
          if (char.proper) cs += "^"

          const preEss = char.pre.map(serializeElement)
          const mainEs = serializeElement(char.main)
          const postEss = char.post.map(serializeElement)

          cs += [...preEss, mainEs].join("+")
          if (
            char.post.length &&
            (("consonant" in char.main && "consonant" in char.post[0]) ||
              hasOwnProp(data.consonants, mainEs + postEss[0]) ||
              (char.pre.length === 0 &&
                char.post.length === 1 &&
                hasOwnProp(data.modifiers, mainEs + postEss[0])))
          )
            cs += "~"
          cs += postEss.join("+")

          return cs.replace(/~\+/g, "~")
        })
        .join("_")
        .replace(/_-/g, "-")
    )
    .join(" ")
}

const initialRe = new RegExp(
  `^(?:w|${Object.keys(data.consonants)
    .filter(c => c && !c.match(/^(?:\d|x[a-f])$/))
    .sort((a, b) => b.length - a.length)
    .join("|")})`
)
const finalRe = new RegExp(
  `^(${Object.keys(data.glides).join("|")})?` +
    `(?:(${Object.keys(data.vowels).join("|")})` +
    `(${Object.keys(data.codas).join("|")})?)?(?<=.)(~?)$`
)

export function deserializeElement(s: string, allowModifier = false): Element {
  if (!s) throw new SyntaxError("Empty element")
  if (s === "w") return { consonant: "" }
  if (s === "ih") return {}
  if (s === "ih~") return { reversed: true }
  if (hasOwnProp(data.consonants, s)) return { consonant: s }
  if (allowModifier && hasOwnProp(data.modifiers, s)) return { modifier: s }

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

      const ess = cs.split(/\+|(?<=~)/)
      for (const es of ess) {
        try {
          ;(main ? post : pre).push(deserializeElement(es, ess.length === 1))
        } catch (err) {
          // try parsing as a main-post element combination instead
          const initial = initialRe.exec(es)?.[0]
          if (initial) {
            const final = es.slice(initial.length)
            if (final) {
              if (main)
                throw new SyntaxError(
                  `Unexpected main-post element ${sli(es)} in char ${sli(cs)}`
                )
              main = deserializeElement(initial)
              if (final !== "~") post.push(deserializeElement(final)) // null final, only used to mark main element
              continue
            }
          }

          throw err
        }
      }

      if (!main) {
        // no main-post element combination found
        // the last element is main, but it must be a consonant if there is more than one element
        main = pre.pop()
        if (!main || (!("consonant" in main) && pre.length))
          throw new SyntaxError(`No main element found in char ${sli(cs)}`)
      }

      return { ...char, main, pre, post } as Character
    })
  )
}
