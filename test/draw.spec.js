const { draw } = require("../src/draw")
const { parseSVG } = require("svg-path-parser")

describe("draw", function () {
  describe("draw()", function () {
    it("should produce a valid SVG path", function () {
      const result = draw([
        // ni3_hau3 sh4_jie4
        [
          {
            main: { consonant: "n" },
            pre: [{ glide: "i", reversed: true }],
            post: [],
          },
          {
            main: { consonant: "h" },
            pre: [{ vowel: "a", coda: "u", reversed: true }],
            post: [],
          },
        ],
        [
          {
            main: { consonant: "sh" },
            pre: [],
            post: [{ reversed: true }],
          },
          {
            main: { consonant: "j" },
            pre: [],
            post: [{ glide: "i", vowel: "e", reversed: true }],
          },
        ],

        // Vnu8_AHL xdi8_aho
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

      parseSVG(result.match(/\bd="([^"]*)"/)[1])
    })
  })
})
