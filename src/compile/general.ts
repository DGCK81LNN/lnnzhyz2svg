import { Character, CompiledText } from "../types"

export function compileGeneral(
  input: string,
  ...handlers: ((char: string) => Character)[]
): CompiledText {
  const words = input.trim().split(/\s+/g)
  return words.map(word => {
    const chars = word.split(/_|(?=-)/g)
    return chars.map(char => {
      let props: Partial<Character> = {}

      if (char[0] === "-") {
        props.hyphen = true
        char = char.slice(1)
      }
      if (char[0] === "^") {
        props.proper = true
        char = char.slice(1)
      }

      let character: Character
      for (const handler of handlers) {
        character = handler(char)
        if (character) break
      }
      if (!character) throw new SyntaxError(`invalid character ${char}`)

      return Object.assign(props, character)
    })
  })
}
