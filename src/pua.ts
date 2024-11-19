import { Character, CompiledText, Element } from "./types"
import { elementEquals, findKey, hasOwnProp } from "./utils"

export interface StringifyOptions {
  mandarin?: boolean
}

const FCP = String.fromCodePoint
function hex(cp: number) {
  if (cp === undefined) return "EOF"
  return cp.toString(16).toUpperCase().padStart(4, "0")
}

let initialized = false
const LETTERS: Record<number, Element> = {}
const MANDARIN_INITIALS: Record<string, number> = {}
const HYPHEN = 0xe06e
const PROPER = 0xe06f
const TONES = {
  "1": 0xe070,
  "2": 0xe071,
  "3": 0xe072,
  "4": 0xe073,
}
const GLIDES: Record<number, string> & Record<string, number> = {}
const VOWELS: Record<number, string> & Record<string, number> = {}
const CODAS: Record<number, string> & Record<string, number> = {}
const TAIL_M = 0xe080
const TAIL_NG = 0xe081
const PRES: Record<number, Element> = {}
const POSTS: Record<number, Element> = {}

function init() {
  if (initialized) return

  for (let i = 0; i < 10; i++) LETTERS[0xe040 + i] = { consonant: String(i) }
  for (let i = 10; i < 16; i++)
    LETTERS[0xe040 + i] = { consonant: `x${i.toString(16)}` }
  " b p m f d t n l g k h j q x zh ch sh r z c s v"
    .split(" ")
    .forEach((l, i) => {
      LETTERS[0xe050 + i] = { consonant: l }
      MANDARIN_INITIALS[l] = 0xe050 + i
    })
  "i u y".split(" ").forEach((l, i) => {
    LETTERS[0xe067 + i] = { glide: l }
    GLIDES[(GLIDES[l] = 0xe074 + i)] = l
  })
  "e a o".split(" ").forEach((l, i) => {
    LETTERS[0xe06a + i] = { vowel: l }
    VOWELS[(VOWELS[l] = 0xe077 + i)] = l
  })
  VOWELS[(VOWELS.eh = 0xe07a)] = "eh"
  LETTERS[0xe06d] = { modifier: "rr" }
  "i u n ng r".split(" ").forEach((l, i) => {
    CODAS[(CODAS[l] = 0xe07b + i)] = l
  })

  {
    let cp = 0xe090
    const defineMandarinFinal = (el: Element | null) => {
      POSTS[cp++] = { ...el }
      PRES[cp++] = { ...el }
      PRES[cp++] = { ...el, reversed: true }
      POSTS[cp++] = { ...el, reversed: true }
    }

    for (const g of [null, { glide: "i" }, { glide: "u" }, { glide: "y" }]) {
      defineMandarinFinal(g)
      for (const vowel of "ea")
        for (const c of [
          null,
          { coda: "i" },
          { coda: "u" },
          { coda: "n" },
          { coda: "ng" },
          { coda: "r" },
        ])
          defineMandarinFinal({ ...g, vowel, ...c })
    }

    defineMandarinFinal({ vowel: "o" })
    defineMandarinFinal({ vowel: "o", coda: "ng" })
    defineMandarinFinal({ vowel: "eh" })
  }

  "yj nj rz nz ng ngw nw dw tw gw kw".split(" ").forEach((l, i) => {
    LETTERS[0xe170 + i] = { consonant: l }
  })
  LETTERS[0xe180] = { vowel: "oo" }
  LETTERS[0xe181] = { vowel: "ii" }
  LETTERS[0xe182] = { vowel: "uu" }
  LETTERS[0xe183] = { vowel: "a", coda: "i" }
  LETTERS[0xe184] = { vowel: "a", coda: "u" }
  LETTERS[0xe185] = { vowel: "e", coda: "u" }
  LETTERS[0xe186] = { vowel: "a", coda: "n" }
  LETTERS[0xe187] = { vowel: "a", coda: "ng" }
  LETTERS[0xe188] = { vowel: "e", coda: "n" }
  LETTERS[0xe189] = { vowel: "e", coda: "ng" }
  LETTERS[0xe18a] = { vowel: "e", coda: "i" }
  LETTERS[0xe18b] = {}

  {
    let cp = 0xe190
    const defineShidinnAddition = (el: Element | null) => {
      POSTS[cp++] = { ...el }
      PRES[cp++] = { ...el }
    }

    "b p m v j q x yj nj z c s rz nz ng n d t g k h w ngw nw dw tw gw kw f"
      .split(" ")
      .forEach(c => defineShidinnAddition({ consonant: c }))

    cp = 0xe1d0
    defineShidinnAddition({ vowel: "oo" })
    defineShidinnAddition({ vowel: "ii" })
    defineShidinnAddition({ vowel: "uu" })

    cp = 0xe1d8
    defineShidinnAddition({ glide: "i", vowel: "oo" })
    defineShidinnAddition({ glide: "i", vowel: "uu" })
    defineShidinnAddition({ glide: "u", vowel: "oo" })
    defineShidinnAddition({ glide: "u", vowel: "ii" })
  }

  initialized = true
}

function stringifyElement(mapping: Record<number, Element>, el: Element) {
  const cp = findKey(mapping, v => elementEquals(v, el))
  if (cp === undefined)
    throw new Error("Cannot stringify element " + JSON.stringify(el))
  return FCP(+cp)
}

export function stringifyCharacter(
  char: Character,
  options?: StringifyOptions
) {
  init()
  let s = ""
  if (char.hyphen) s += FCP(HYPHEN)
  if (char.proper) s += FCP(PROPER)

  mandarin: if (options?.mandarin) {
    if (char.pre.length + char.post.length !== 1) break mandarin

    let sm = s
    if (
      !("consonant" in char.main) ||
      !hasOwnProp(MANDARIN_INITIALS, char.main.consonant)
    )
      break mandarin
    sm += FCP(MANDARIN_INITIALS[char.main.consonant])

    const isPre = !!char.pre.length
    const final = isPre ? char.pre[0] : char.post[0]
    if (!isPre && char.main.consonant === "h") {
      if (elementEquals(final, { consonant: "m" })) return sm + FCP(TAIL_M)
      if (elementEquals(final, { consonant: "w" })) return sm + FCP(TAIL_NG)
    }

    if ("consonant" in final || "modifier" in final) break mandarin
    const tone = final.reversed ? (isPre ? "3" : "4") : isPre ? "2" : "1"
    sm += FCP(TONES[tone])
    if ("glide" in final) sm += FCP(GLIDES[final.glide])
    if ("vowel" in final) {
      if (!hasOwnProp(VOWELS, final.vowel)) break mandarin
      sm += FCP(VOWELS[final.vowel])
    }
    if ("coda" in final) sm += FCP(CODAS[final.coda])
    return sm
  }

  for (const el of char.pre) s += stringifyElement(PRES, el)
  s += stringifyElement(LETTERS, char.main)
  for (const el of char.post) s += stringifyElement(POSTS, el)
  return s
}

export function stringifyText(text: CompiledText, options?: StringifyOptions) {
  return text
    .map(word => word.map(ch => stringifyCharacter(ch, options)).join(""))
    .join(" ")
}

export class ParseError extends Error {
  name = "lnnzhyz2svg.PUA.ParseError"
}

export function parseCharacter(input: string) {
  init()
  const cps = [...input].map(c => c.codePointAt(0))
  let i = 0

  const props: Partial<Character> = {}
  const pre: Element[] = []
  let main: Element
  const post: Element[] = []

  const ok = (character?: Partial<Character>) => ({
    source: String.fromCodePoint(...cps.slice(0, i)),
    character: { ...props, pre, main, post, ...character } as Character,
  })

  if (cps[i] === HYPHEN) {
    i++
    props.hyphen = true
  }

  if (cps[i] === 0xe06d) {
    i++
    return ok({ main: { modifier: "rr" } })
  }

  if (cps[i] === PROPER) {
    i++
    props.proper = true
  }

  while (hasOwnProp(PRES, cps[i])) pre.push(PRES[cps[i++]])

  if (!hasOwnProp(LETTERS, cps[i]))
    throw new ParseError(
      `Unexpected ${hex(cps[i])}, expected ${
        pre.length ? "consonant " : ""
      }letter`
    )
  main = LETTERS[cps[i]]
  if (
    pre.length &&
    (!("consonant" in main) || /^\d$|^x[a-f]$/.test(main.consonant))
  )
    throw new ParseError(`Unexpected ${hex(cps[i])}, expected consonant letter`)
  i++

  mandarin: if (!pre.length) {
    if (cps[i] === TAIL_M) return ok({ post: [{ consonant: "m" }] })
    if (cps[i] === TAIL_NG) return ok({ post: [{ consonant: "w" }] })
    const tone = findKey(TONES, v => v === cps[i])
    if (!tone) break mandarin
    i++
    const final: Element = {}
    if (tone === "3" || tone === "4") final.reversed = true
    if (hasOwnProp(GLIDES, cps[i])) final.glide = GLIDES[cps[i++]]
    vowel: if (hasOwnProp(VOWELS, cps[i])) {
      if ("glide" in final && !["e", "a"].includes(VOWELS[cps[i]])) break vowel
      final.vowel = VOWELS[cps[i++]]
      if (hasOwnProp(CODAS, cps[i])) final.coda = CODAS[cps[i++]]
    }
    if (tone === "2" || tone === "3") return ok({ pre: [final] })
    return ok({ post: [final] })
  }

  while (hasOwnProp(POSTS, cps[i])) post.push(POSTS[cps[i++]])

  return ok()
}

export function parseMixed(input: string) {
  const result: (string | Character[])[] = []
  while (input.length) {
    const word: Character[] = []
    while (input.length) {
      const cp = input.codePointAt(0)
      if (cp < 0xe040 || cp > 0xe1df) break
      let r: ReturnType<typeof parseCharacter>
      try {
        r = parseCharacter(input)
      } catch (e) {
        if (e instanceof ParseError) break
        throw e
      }
      const { source, character } = r
      word.push(character)
      input = input.slice(source.length)
    }
    if (word.length) {
      if (result[result.length - 1] === " ") result.pop()
      result.push(word)
    } else {
      const c = String.fromCodePoint(input.codePointAt(0))
      if (typeof result[result.length - 1] === "string")
        result[result.length - 1] += c
      else result.push(c)
      input = input.slice(c.length)
    }
  }
  return result
}
