import type { Element } from "./types"

export function hasOwnProp(obj: object, key: string | number | symbol) {
  return Object.prototype.hasOwnProperty.call(obj, key) as boolean
}

export function getOwnProp<
  O extends object,
  K extends string | number | symbol,
  V
>(obj: O, key: K, def?: V): (K extends keyof O ? O[K] : never) | V {
  return hasOwnProp(obj, key) ? (obj as { [k in K]: V })[key] : def
}

export function flipPath(d: string, hori: boolean, vert: boolean) {
  if (!(hori || vert)) return d

  return d
    .replace(/([hv])(-?)(\d+(?:\.\d+)?)/g, (_, c, s, n) => {
      if (c === "h" ? hori : vert) s = s ? "" : "-"
      return `${c}${s}${n}`
    })
    .replace(/m(-?)(\d+(?:\.\d+)?),(-?)(\d+(?:\.\d+)?)/g, (_, sx, x, sy, y) => {
      if (hori) sx = sx ? "" : "-"
      if (vert) sy = sy ? "" : "-"
      return `m${sx}${x},${sy}${y}`
    })
}

/**
 * Roughly same as `Array.prototype.findIndex` but does not take empty cells
 * into account, and returns length of array if not found.
 */
export function findIndex<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => unknown
) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    if (predicate(array[i], i, array)) return i
  }
  return len
}

/**
 * Roughly same as `Array.prototype.findLastIndex` but does not take empty cells
 * into account.
 */
export function findLastIndex<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => unknown
) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) return i
  }
  return -1
}

export function findKey<K extends string | number, V>(
  obj: Record<K, V>,
  predicate: (v: V, k: K) => boolean
): string | undefined {
  for (const k in obj) {
    if (predicate(obj[k], k)) return k
  }
  return undefined
}

function isPropEqual<T extends object>(a: T, b: T, key: keyof T) {
  if (key in a) return key in b && a[key] === b[key]
  if (key in b) return false
  return undefined
}
function finalEquals(a: Element, b: Element) {
  if (!!a.reversed !== !!b.reversed) return false
  if (isPropEqual(a, b, "glide") === false) return false
  if (isPropEqual(a, b, "vowel") === false) return false
  if (isPropEqual(a, b, "coda") === false) return false
  return true
}
export function elementEquals(a: Element, b: Element) {
  return (
    isPropEqual(a, b, "consonant") ??
    isPropEqual(a, b, "modifier") ??
    finalEquals(a, b)
  )
}
