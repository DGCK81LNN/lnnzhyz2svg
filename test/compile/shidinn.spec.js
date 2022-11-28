const { expect } = require("chai")
const { compileShidinn } = require("../../src/compile/shidinn")

describe("compile", function () {
  describe("shidinn", function () {
    describe("compileShidinn", function () {
      it("compiles a piece of shidinn text", function () {
        const source = "Vnu8_AHL ^xdi8_aho"
        const result = compileShidinn(source)

        /** @type {import("../../src/types").CompiledText} */
        const expected = [
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
        ]
        expect(result).to.deep.equal(expected)
      })

      it("compiles a slightly more complex piece of shidinn text", function () {
        const source = "yy8i_xho_kD3H t38_gzoT xd8"
        const result = compileShidinn(source)

        /** @type {import("../../src/types").CompiledText} */
        const expected = [
          [
            {
              pre: [{ consonant: "y" }],
              main: { consonant: "y" },
              post: [{ vowel: "e", coda: "ng" }, { glide: "i" }],
            },
            {
              pre: [{ consonant: "x" }],
              main: { consonant: "h" },
              post: [{ vowel: "oo" }],
            },
            {
              pre: [{ consonant: "k" }],
              main: { consonant: "c" },
              post: [{ vowel: "e", coda: "n" }, { consonant: "nz" }],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "t" },
              post: [
                { vowel: "e", coda: "n" },
                { vowel: "e", coda: "ng" },
              ],
            },
            {
              pre: [{ consonant: "g" }],
              main: { consonant: "z" },
              post: [{ vowel: "oo" }, { vowel: "a", coda: "ng" }],
            },
          ],
          [
            {
              pre: [{ consonant: "x" }],
              main: { consonant: "d" },
              post: [{ vowel: "e", coda: "ng" }],
            },
          ],
        ]
        expect(result).to.deep.equal(expected)
      })

      it("recognizes hyphens", function () {
        const source = "4-yruL"
        const result = compileShidinn(source)

        /** @type {import("../../src/types").CompiledText} */
        const expected = [
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [],
            },
            {
              hyphen: true,
              pre: [{ consonant: "y" }],
              main: { consonant: "r" },
              post: [{ glide: "u", vowel: "a", coda: "u" }],
            },
          ],
        ]
        expect(result).to.deep.equal(expected)
      })
    })
  })
})
