import { compileMandarin, compileShidinn } from "./compile"
import { draw } from "./draw"

export { compileMandarin, compileShidinn, draw }

export function drawMandarin(input: string) {
  return draw(compileMandarin(input))
}
export function drawShidinn(input: string) {
  return draw(compileShidinn(input))
}
