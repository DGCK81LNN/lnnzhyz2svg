const { draw } = require("../src")
const { serializeText } = require("../lib/notation")
const { expect } = require("earl")
const { parseSVG } = require("svg-path-parser")
const { ec, sthToDraw } = require("./utils")

describe("draw", function () {
  describe("draw()", function () {
    it("supports raw option", function () {
      const text = [
        [
          {
            main: { consonant: "h" },
            pre: [],
            post: [{ vowel: "a", coda: "i" }],
          },
        ],
      ]
      expect(draw(text)).toBeA(String)
      expect(draw(text, { raw: true })).toEqual({
        d: expect.a(String),
        strokeWidth: 1,
        left: -1,
        top: -2.5,
        width: 12,
        height: 17,
        heightEms: 1.0625,
        verticalAlignEms: -0.15625,
      })
    })

    it("supports strokeWidth option", function () {
      const text = [
        [
          {
            main: { consonant: "h" },
            pre: [{ vowel: "a", coda: "u", reverse: true }],
            post: [],
          },
        ],
      ]
      expect(draw(text, { raw: true, strokeWidth: 0.5 })).toEqual({
        d: expect.a(String),
        strokeWidth: 0.5,
        left: -0.75,
        top: -2.25,
        width: 12,
        height: 16.5,
        heightEms: 1.03125,
        verticalAlignEms: -0.140625,
      })
      expect(draw(text, { raw: true, strokeWidth: 1.5 })).toEqual({
        d: expect.a(String),
        strokeWidth: 1.5,
        left: -1.25,
        top: -2.75,
        width: 12,
        height: 17.5,
        heightEms: 1.09375,
        verticalAlignEms: -0.171875,
      })
    })

    it("should produce a valid SVG path", function () {
      for (const word of sthToDraw.words()) {
        const text = [word]
        let msg = "Error drawing {text}"
        let d = ""
        try {
          const res = draw(text, { raw: true })
          expect(res).toHaveSubset({ d: expect.a(String) })
          msg = "Invalid SVG path {d} generated for text {text}"
          parseSVG(res.d)
        } catch (err) {
          throw ec(
            msg
              .replace("{text}", () => sli(serializeText(text)))
              .replace("{d}", () => sli(d)),
            err
          )
        }
      }
    })
  })
})
