const { expect } = require("chai")
const { draw } = require("../src/draw")

describe("draw", function () {
  describe("draw()", function () {
    // This method returns an SVG so it's hard to write a spec for it, but
    it("should at least not write 'undefined' in its results", function () {
      const result = draw([
        [
          {
            pre: [{ vowel: "e", coda: "i" }],
            main: { consonant: "nj" },
            post: [{ glide: "u", vowel: "e", coda: "ng" }],
          },
          {
            pre: [{ vowel: "uu" }],
            main: { consonant: "nz" },
            post: [{ vowel: "a", coda: "u" }],
          },
        ],
        [
          {
            proper: true,
            pre: [{ consonant: "x" }],
            main: { consonant: "d" },
            post: [{ glide: "i", vowel: "e", coda: "ng" }],
          },
          {
            pre: [{ vowel: "a" }],
            main: { consonant: "h" },
            post: [{ vowel: "oo" }],
          },
        ],
      ])
      expect(result).to.not.include("undefined")
    })
  })
})
