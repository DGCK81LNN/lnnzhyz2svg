import type { Element, Character } from "../../src/types"

function* infinite<T>(
  fun: (n: number) => Generator<T, void>
): Generator<T, never> {
  let i = 0
  while (true) yield* fun(i++)
}

function* repeatedPermutation<T>(
  items: T[],
  length: number
): Generator<T[], void> {
  length = 0 | length
  if (!length) {
    yield []
    return
  }
  for (const p of repeatedPermutation(items, length - 1))
    for (const item of items) yield [...p, item]
}

export function* consonants(): Generator<Element, void> {
  for (const consonant of /*prettier-ignore*/ [
    "", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x",
    "zh", "ch", "sh", "r", "z", "c", "s",
    "v", "yj", "nj", "rz", "nz", "ng", "ngw", "nw", "dw", "tw", "gw", "kw",
  ])
    yield { consonant }
}

export function* shidinnConsonants(): Generator<Element, void> {
  for (const consonant of /*prettier-ignore*/ [
    "b", "p", "m", "v", "j", "q", "x", "yj", "nj",
    "z", "c", "s", "rz", "nz",
    "ng", "n", "d", "t", "g", "k", "h", "",
    "ngw", "nw", "dw", "tw", "gw", "kw", "f",
  ])
    yield { consonant }
}

const glides = ["", "i", "u", "y"]
const vowels = ["", "e", "a"]
const codas = ["", "i", "u", "n", "ng", "r"]
const standaloneVowels = ["o", "eh", "oo", "ii", "uu"]

export function* finals(n = 0): Generator<Element, void> {
  let i = n % 4
  let j = (n * 2) % 6

  for (const vowel of vowels) {
    const el = Object.assign(
      i ? { glide: glides[i] } : {},
      vowel ? { vowel } : null,
      vowel && j ? { coda: codas[j] } : null,
      i % 2 ? { reversed: true } : 0
    )
    if (vowel) {
      j++
      j %= 6
    }
    i++
    i %= 4
    yield el
  }
  yield Object.assign(
    { vowel: standaloneVowels[n % 5] },
    n % 10 === 5 ? { coda: "ng" } : null,
    i % 2 ? { reversed: true } : 0
  )
}

export function* digits(): Generator<Element, void> {
  for (const n of /*prettier-ignore*/ [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "xa", "xb", "xc", "xd", "xe", "xf",
  ])
    yield { consonant: n }
}

export function* modifiers(): Generator<Element, void> {
  yield { modifier: "rr" }
}

export function* characters(): Generator<Character, void> {
  let fi = 0
  /** Returns an array of four final elements. */
  const fa = () => [...finals(fi++)]

  const infCons = infinite(consonants)
  /** Returns a consonant element. */
  const c = () => infCons.next().value

  const infXdCons = infinite(shidinnConsonants)
  /** Returns a narrow consonant element. */
  const xc = () => infXdCons.next().value

  yield { main: c(), pre: [], post: [] }
  for (const f of fa()) {
    delete f.reversed
    yield { main: f, pre: [], post: [] }
  }
  for (const f of digits()) yield { main: f, pre: [], post: [] }
  for (const f of modifiers()) yield { main: f, pre: [], post: [] }

  for (const f of fa()) yield { main: c(), pre: [f], post: [] }
  for (const f of fa()) yield { main: c(), pre: [], post: [f] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1], post: [f2] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1, f2], post: [] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [], post: [f1, f2] }
  for (const [f1, f2, f3] of repeatedPermutation(fa(), 3))
    yield { main: c(), pre: [f1, f2], post: [f3] }
  for (const [f1, f2, f3] of repeatedPermutation(fa(), 3))
    yield { main: c(), pre: [f1], post: [f2, f3] }
  for (const [f1, f2, f3] of repeatedPermutation(fa(), 3))
    yield { main: c(), pre: [f1, f2, f3], post: [] }
  for (const [f1, f2, f3] of repeatedPermutation(fa(), 3))
    yield { main: c(), pre: [], post: [f1, f2, f3] }

  yield { main: { consonant: "h" }, pre: [], post: [{ consonant: "m" }] }
  yield { main: { consonant: "h" }, pre: [], post: [{ consonant: "" }] }

  for (const f of fa()) yield { main: xc(), pre: [xc()], post: [f] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [xc(), f1], post: [f2] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1, xc()], post: [f2] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [xc()], post: [f1, f2] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1], post: [f2, xc()] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [xc(), f1, f2], post: [] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1, xc(), f2], post: [] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [f1, f2, xc()], post: [] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [], post: [f1, xc(), f2] }
  for (const [f1, f2] of repeatedPermutation(fa(), 2))
    yield { main: c(), pre: [], post: [f1, f2, xc()] }
}

export function* words() {
  let i = 0
  for (const char of characters()) {
    const isNumeralOrModifier =
      "modifier" in char.main ||
      ("consonant" in char.main &&
        /^(?:[0-9]|x[a-f])$/.test(char.main.consonant!))
    yield [
      Object.assign(
        !isNumeralOrModifier && i % 2 ? { proper: true } : {},
        char
      ),
      Object.assign(
        char,
        !isNumeralOrModifier && !(i % 2) ? { proper: true } : null,
        i % 4 >= 2 ? { hyphen: true } : null
      ),
    ]
    i++
  }
}
