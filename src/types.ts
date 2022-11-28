export interface Consonant {
  consonant: string
}
export interface Final {
  glide?: string
  vowel?: string
  coda?: string
}
export interface Modifier {
  modifier: string
}
export type Element = Final | Consonant | Modifier

export interface Character {
  proper?: boolean
  hyphen?: boolean
  pre: Element[]
  main: Element
  post: Element[]
  reverseAffixes?: boolean
}

export type CompiledText = Character[][]
