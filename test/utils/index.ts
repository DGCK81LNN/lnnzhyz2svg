import { inspect } from "node:util"
import { hasOwnProp } from "../../src/utils"
import data from "../../src/draw/data.json"
import type { Character, CompiledText, Element } from "../../src/types"

export * as sthToDraw from "./sth_to_draw"

/** Error with cause. */
export function ec(
  message: string,
  cause: unknown
): Error & { cause: unknown } {
  return Object.assign(new Error(message), { cause })
}

/** Single-line inspect. */
export function sli(thing: unknown) {
  return inspect(thing, { breakLength: Infinity })
}

export function getPathD(svg: string) {
  const m = svg.match(/\bd="([^"]*)"/)
  if (!m) throw new Error("No path found in SVG")
  return m[1]
}

/** Template string with falsey values (except the number zero) interpolated treated as the empty string. */
export function tS(segs: readonly string[], ...interp: unknown[]) {
  return String.raw(
    { raw: segs },
    ...interp.map(x => (x === false || x == null ? "" : x))
  )
}

/** Get a very compact string representation for `el`. */
export function serializeElement(el: Element) {
  if ("consonant" in el) return el.consonant || "w"
  if ("modifier" in el) return el.modifier
  return (
    (tS`${el.glide}${el.vowel && tS`${el.vowel}${el.coda}`}` || "ih") +
    tS`${el.reversed && "~"}`
  )
}

/** Get a very compact string representation for `text`. */
export function serializeText(text: CompiledText) {
  return text
    .map(word =>
      word
        .map(char =>
          tS`${char.hyphen && "-"}${char.proper && "^"}${
            char.pre.map(el => serializeElement(el) + "+").join("") +
            serializeElement(char.main) +
            char.post.map(el => serializeElement(el)).join("+")
          }`.replace(/~\+/g, "~")
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
    `(${Object.keys(data.codas).join("|")})?)?(~?)$`
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
        if (!pre.length)
          throw new SyntaxError(`No main element found in char ${sli(cs)}`)
        main = pre.pop()!
      }

      return { ...char, main, pre, post } as Character
    })
  )
}
