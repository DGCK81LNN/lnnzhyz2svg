import { compileMandarin, compileShidinn } from "./compile"
import { type DrawOptions, type RawDrawResult, draw } from "./draw"

export { compileMandarin, compileShidinn, draw }

export function drawMandarin(
  input: string,
  options?: DrawOptions & { raw?: false }
): string
export function drawMandarin(
  input: string,
  options: DrawOptions & { raw: true }
): RawDrawResult
export function drawMandarin(input: string, options?: DrawOptions) {
  return draw(compileMandarin(input), options)
}

export function drawShidinn(
  input: string,
  options?: DrawOptions & { raw?: false }
): string
export function drawShidinn(
  input: string,
  options: DrawOptions & { raw: true }
): RawDrawResult
export function drawShidinn(input: string, options?: DrawOptions) {
  return draw(compileShidinn(input), options)
}

export * as PUA from "./pua"

export { elementEquals } from "./utils"
