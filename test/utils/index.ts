export * as sthToDraw from "./sth_to_draw"

/** Error with cause. */
export function ec(
  message: string,
  cause: unknown
): Error & { cause: unknown } {
  return Object.assign(new Error(message), { cause })
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
