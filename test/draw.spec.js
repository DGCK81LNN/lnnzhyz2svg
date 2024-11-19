const { draw } = require("../src")
const { serializeText } = require("../lib/notation")
const { parseSVG } = require("svg-path-parser")
const { ec, getPathD, sthToDraw } = require("./utils")

describe("draw", function () {
  describe("draw()", function () {
    it("should produce a valid SVG path", function () {
      for (const word of sthToDraw.words()) {
        const text = [word]
        let msg = "Failed to draw text {text}"
        let d = ""
        try {
          const svg = draw(text)
          msg = "Cannot find path in result of drawing text {text}"
          d = getPathD(svg)
          msg = "Invalid SVG path {d} generated for text {text}"
          parseSVG(d)
        } catch (err) {
          throw ec(
            msg
              .replace("{text}", sli(serializeText(text)))
              .replace("{d}", sli(d)),
            err
          )
        }
      }
    })
  })
})
