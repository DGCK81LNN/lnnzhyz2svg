import { Element, CompiledText } from "./types"
import { findIndex, findLastIndex, flipPath } from "./utils"
import data from "./data.json"

const { consonants, glides, vowels, codas, modifiers, narrowConsonants } = data

function drawAffix(
  element: Element,
  x: number,
  shrink?: boolean,
  flipX?: boolean
) {
  if ("consonant" in element) {
    return (
      `M${flipX ? x : x - 2},0` +
      narrowConsonants[element.consonant].replace(/\((\d+)\)/g, (_, num) =>
        shrink ? num - 2 : num
      )
    )
  }

  if ("modifier" in element) return `M${x - 2},0` + modifiers[element.modifier]

  let d = ""
  if ("glide" in element)
    d +=
      `M${flipX ? x + 2 : x - 2},${element.reversed ? 12 : 0}` +
      flipPath(glides[element.glide], flipX, element.reversed)

  d += `M${x},${element.reversed ? 12 : 0}`
  if ("vowel" in element) {
    d += flipPath(vowels[element.vowel], flipX, element.reversed)
    if ("coda" in element)
      d +=
        `M${flipX ? x + 2 : x - 2},${element.reversed ? 2 : 10}` +
        flipPath(codas[element.coda], flipX, element.reversed)
    else if (["e", "a", "o", "eh"].includes(element.vowel))
      d += `v${(element.reversed ? -1 : 1) * (shrink ? 4 : 6)}`
  } else {
    d += `v${(element.reversed ? -1 : 1) * (shrink ? 10 : 12)}`
  }

  return d
}

/** Returns true if the given pre element connects to the character at the top. */
function connectsTop(pre: Element) {
  if (pre.reversed) {
    if (pre.coda) return false
    if (["oo", "ii", "uu"].includes(pre.vowel)) return false
  }
  return true
}

export interface DrawOptions {
  /** Return an object containing all the information about the drawn text, rather than an SVG string. */
  raw?: boolean
  /** Defaults to 1. Should be between 0 and 2 (exclusive). */
  strokeWidth?: number
}

export interface RawDrawResult {
  /** Stroke width of the SVG path in CSS pixels. */
  strokeWidth: number
  /** Starting X coordinate of the SVG image's view box in CSS pixels. */
  left: number
  /** Starting Y coordinate of the SVG image's view box in CSS pixels. */
  top: number
  /** Width of the SVG image's view box in CSS pixels. */
  width: number
  /** Height of the SVG image's view box in CSS pixels. */
  height: number
  /** Height of the SVG element in ems when placed in a paragraph. */
  heightEms: number
  /** vertical-align of the SVG element in ems when placed in a paragraph. */
  verticalAlignEms: number
  /** Path data. */
  d: string
}

export function draw(
  text: CompiledText,
  options?: DrawOptions & { raw?: false }
): string
export function draw(
  text: CompiledText,
  options: DrawOptions & { raw: true }
): RawDrawResult
export function draw(
  text: CompiledText,
  options?: DrawOptions
): string | RawDrawResult
export function draw(text: CompiledText, options?: DrawOptions) {
  let d = ""
  let x = 0
  text.forEach(word => {
    const bottomLineStartX = x + 4 * findIndex(word[0].pre, el => el.reversed)
    let bottomLineEndX = Infinity
    const hyphens: number[] = []

    word.forEach((char, charIndex) => {
      if (char.hyphen) hyphens.push(x - 2)

      const properLineEndX = x + 4 * findIndex(char.pre, connectsTop)
      const topLineStartX = x + 4 * findIndex(char.pre, pre => !pre.reversed)
      const mainX = x + 4 * char.pre.length

      if (char.proper) {
        d += `M${x},-2v2`
        if (properLineEndX > x && properLineEndX <= topLineStartX)
          d += `H${properLineEndX}`
      }
      if (topLineStartX < mainX) {
        if (
          !char.proper ||
          properLineEndX === x ||
          properLineEndX < topLineStartX
        )
          d += `M${topLineStartX},0`
        d += `H${mainX}`
      }

      char.pre.forEach(element => {
        d += drawAffix(
          element,
          x,
          element.reversed
            ? x < properLineEndX || x > topLineStartX
            : x > bottomLineStartX,
          true
        )
        x += 4
      })

      if ("modifier" in char.main) {
        d += `M${x},0` + modifiers[char.main.modifier]
        x += 2
      } else if ("consonant" in char.main) {
        d += `M${x},0` + consonants[char.main.consonant]
        x += 6
      } else {
        d += `M${x},0h2` + drawAffix(char.main, x + 2, false, false)
        x += 2
      }

      if (charIndex === word.length - 1) {
        bottomLineEndX =
          x + 4 * (findLastIndex(char.post, el => el.reversed) + 1)
      }
      if (char.post.length) {
        const topLineEndX =
          x + 4 * (findLastIndex(char.post, element => !element.reversed) + 1)
        if (topLineEndX > x) d += `M${x},0H${topLineEndX}`
        char.post.forEach(element => {
          x += 4
          d += drawAffix(
            element,
            x,
            element.reversed ? x < topLineEndX : x < bottomLineEndX,
            false
          )
        })
      }
      x += 2
    })

    d += `M${bottomLineStartX},12`
    hyphens.forEach(x => {
      d += `H${x}v2h2v-2`
    })
    d += `H${bottomLineEndX}`
  })

  const strokeWidth = options?.strokeWidth ?? 1
  const left = -0.5 - strokeWidth / 2
  const top = -2 - strokeWidth / 2
  const width = x
  const height = 16 + strokeWidth
  const heightEms = height / 16
  const verticalAlignEms = -(2 + strokeWidth / 2) / 16

  if (options?.raw)
    return {
      strokeWidth,
      left,
      top,
      width,
      height,
      heightEms,
      verticalAlignEms,
      d,
    }

  return /* xml */ `<svg xmlns="http://www.w3.org/2000/svg" height="${heightEms}em" viewBox="${left},${top},${width},${height}" style="vertical-align:${verticalAlignEms}em"><path fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="square" d="${d}"/></svg>`
}
