import { inspect } from "node:util"
import type { CompiledText, Element } from "../../src/types"

export * as sthToDraw from "./sth_to_draw"

/** Error with cause. */
export function ec(message: string, cause: unknown): Error & { cause: unknown } {
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
        .map(
          char =>
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
