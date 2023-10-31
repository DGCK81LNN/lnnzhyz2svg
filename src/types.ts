/**
 * A consonant, final or modifier.
 *
 * If one of `consonant` and `modifier` is present, no other prop shall be present alongside it.
 * When neither is present, the element is a final.
 */
export interface Element {
  consonant?: string
  glide?: string
  vowel?: string
  coda?: string
  /** True if the final is reversed. */
  reversed?: boolean
  modifier?: string
}

export interface Character {
  proper?: boolean
  hyphen?: boolean
  pre: Element[]
  main: Element
  post: Element[]
}

export type CompiledText = Character[][]
