import { Element, CompiledText } from "../types"
import { flipPath } from "../utils"
import _data from "./data.json"

const data = _data as Record<string, Record<string, string>>
const { consonants, glides, vowels, codas, modifiers, narrowConsonants } = data

function makeSvg(x: number, d: string) {
  const width = x + 3
  return /* xml */ `<svg xmlns="http://www.w3.org/2000/svg" height="1.1875em" viewBox="-1.5,-3.5,${width},19" style="vertical-align:text-bottom"><path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square" d="${d}"/></svg>`
}

function drawAffix(
  element: Element,
  x: number,
  shrink?: boolean,
  flipX?: boolean,
  flipY?: boolean
) {
  if ("consonant" in element)
    return (
      `M${flipX ? x : x - 2},0` +
      narrowConsonants[element.consonant].replace(/\((\d+)\)/g, (_, num) =>
        shrink ? num - 2 : num
      )
    )

  let d = ""
  if ("glide" in element)
    d +=
      `M${flipX ? x + 2 : x - 2},${flipY ? 12 : 0}` +
      flipPath(glides[element.glide], flipX, flipY)

  d += `M${x},${flipY ? 12 : 0}`
  if ("vowel" in element) {
    d += flipPath(vowels[element.vowel], flipX, flipY)
    if ("coda" in element)
      d +=
        `M${flipX ? x + 2 : x - 2},${flipY ? 2 : 10}` +
        flipPath(codas[element.coda], flipX, flipY)
    else if (["e", "a", "o", "eh"].includes(element.vowel))
      d += `v${flipY ? -6 : shrink ? 4 : 6}`
  } else {
    d += `v${flipY ? -12 : shrink ? 10 : 12}`
  }

  return d
}

export function draw(text: CompiledText): string {
  let d = ""
  let x = 0
  text.forEach(word => {
    const bottomLineStartX = word[0].reverseAffixes
      ? x
      : x + word[0].pre.length * 4
    const hyphens: number[] = []

    word.forEach((char, charIndex) => {
      if (char.proper) d += `M${x},-2v2`
      if (char.hyphen) hyphens.push(x - 2)

      if (char.pre.length) {
        if (char.reverseAffixes) {
          if (char.proper) {
            let stop = char.pre.findIndex(pre => !("coda" in pre))
            if (stop === -1) stop = char.pre.length
            if (stop !== 0) d += `h${stop * 4}`
          }
        } else {
          d += `M${x},0h${char.pre.length * 4}`
        }

        const shrink = charIndex !== 0
        char.pre.forEach(element => {
          d += drawAffix(element, x, shrink, true, char.reverseAffixes)
          x += 4
        })
      }

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

      if (char.post.length) {
        const shrink = charIndex !== word.length - 1
        if (!char.reverseAffixes) d += `M${x},0h${char.post.length * 4}`
        char.post.forEach(element => {
          x += 4
          d += drawAffix(element, x, shrink, false, char.reverseAffixes)
        })
      }
      x += 2
    })

    const bottomLineEndX = word.at(-1).reverseAffixes
      ? x - 2
      : x - 2 - word.at(-1).post.length * 4

    d += `M${bottomLineStartX},12`
    hyphens.forEach(x => {
      d += `H${x}v2h2v-2`
    })
    d += `H${bottomLineEndX}`
  })
  return makeSvg(x - 2, d)
}
