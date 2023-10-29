const { expect } = require("earl")
const { compileMandarin, compileShidinn } = require("../src/compile")

const Sub = expect.subset

describe("compile", function () {
  describe("mandarin", function () {
    describe("compileMandarin()", function () {
      it("compiles a piece of mandarin text", function () {
        const source = "^zhung1_hua2_y3_z4"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            Sub({
              proper: true,
              main: { consonant: "zh" },
              pre: [],
              post: [{ glide: "u", vowel: "e", coda: "ng" }],
            }),
            Sub({
              main: { consonant: "h" },
              pre: [{ glide: "u", vowel: "a" }],
              post: [],
            }),
            Sub({
              main: { consonant: "" },
              pre: [{ glide: "y", reversed: true }],
              post: [],
            }),
            Sub({
              main: { consonant: "z" },
              pre: [],
              post: [{ reversed: true }],
            }),
          ],
        ])
      })

      it("handles special spellings and special syllables", function () {
        const source =
          "hm hng   ng1   iung1   eh1   o1 ong1 ou1 uo1 bo1 hong1 hou1"
        const result = compileMandarin(source)

        expect(result).toEqual([
          // hm hng
          [
            Sub({
              main: { consonant: "h" },
              pre: [],
              post: [{ consonant: "m" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "h" },
              pre: [],
              post: [{ consonant: "" }],
            }),
          ],

          // ng
          [Sub({ main: { consonant: "" }, pre: [], post: [{}] })],

          // iung
          [
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "y", vowel: "e", coda: "ng" }],
            }),
          ],

          //eh
          [Sub({ main: { consonant: "" }, pre: [], post: [{ vowel: "eh" }] })],

          // o ong ou uo bo hong hou
          [Sub({ main: { consonant: "" }, pre: [], post: [{ vowel: "o" }] })],
          [
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ vowel: "o", coda: "ng" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ vowel: "e", coda: "u" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "u", vowel: "e" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "b" },
              pre: [],
              post: [{ glide: "u", vowel: "e" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "h" },
              pre: [],
              post: [{ glide: "u", vowel: "e", coda: "ng" }],
            }),
          ],
          [
            Sub({
              main: { consonant: "h" },
              pre: [],
              post: [{ vowel: "e", coda: "u" }],
            }),
          ],
        ])
      })

      it("recognises letterals", function () {
        const source = "8_1 ^L_^N_^N Xa"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            Sub({ main: { consonant: "8" }, pre: [], post: [] }),
            Sub({ main: { consonant: "1" }, pre: [], post: [] }),
          ],
          [
            Sub({ proper: true, main: { consonant: "l" }, pre: [], post: [] }),
            Sub({ proper: true, main: { consonant: "n" }, pre: [], post: [] }),
            Sub({ proper: true, main: { consonant: "n" }, pre: [], post: [] }),
          ],
          [Sub({ main: { consonant: "xa" }, pre: [], post: [] })],
        ])
      })

      it("recognises hyphens", function () {
        const source = "i1_xin1-i1_i4"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i" }],
            }),
            Sub({
              main: { consonant: "x" },
              pre: [],
              post: [{ glide: "i", vowel: "e", coda: "n" }],
            }),
            Sub({
              hyphen: true,
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i" }],
            }),
            Sub({
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i", reversed: true }],
            }),
          ],
        ])
      })
    })
  })

  describe("shidinn", function () {
    describe("compileShidinn()", function () {
      it("compiles a piece of shidinn text", function () {
        const source = "Vnu8_AHL ^xdi8_aho"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({
              pre: [{ vowel: "e", coda: "i" }],
              main: { consonant: "nj" },
              post: [{ glide: "u", vowel: "e", coda: "ng" }],
            }),
            Sub({
              pre: [{ vowel: "uu" }],
              main: { consonant: "nz" },
              post: [{ vowel: "a", coda: "u" }],
            }),
          ],
          [
            Sub({
              proper: true,
              pre: [{ consonant: "x" }],
              main: { consonant: "d" },
              post: [{ glide: "i", vowel: "e", coda: "ng" }],
            }),
            Sub({
              pre: [{ vowel: "a" }],
              main: { consonant: "h" },
              post: [{ vowel: "oo" }],
            }),
          ],
        ])
      })

      it("compiles a slightly more complex piece of shidinn text", function () {
        const source = "yy8i_xho_kD3H t38_gzoT xd8"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({
              pre: [{ consonant: "y" }],
              main: { consonant: "y" },
              post: [{ vowel: "e", coda: "ng" }, { glide: "i" }],
            }),
            Sub({
              pre: [{ consonant: "x" }],
              main: { consonant: "h" },
              post: [{ vowel: "oo" }],
            }),
            Sub({
              pre: [{ consonant: "k" }],
              main: { consonant: "c" },
              post: [{ vowel: "e", coda: "n" }, { consonant: "nz" }],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "t" },
              post: [
                { vowel: "e", coda: "n" },
                { vowel: "e", coda: "ng" },
              ],
            }),
            Sub({
              pre: [{ consonant: "g" }],
              main: { consonant: "z" },
              post: [{ vowel: "oo" }, { vowel: "a", coda: "ng" }],
            }),
          ],
          [
            Sub({
              pre: [{ consonant: "x" }],
              main: { consonant: "d" },
              post: [{ vowel: "e", coda: "ng" }],
            }),
          ],
        ])
      })

      it("recognizes hyphens", function () {
        const source = "3-yruL"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({ pre: [], main: { vowel: "e", coda: "n" }, post: [] }),
            Sub({
              hyphen: true,
              pre: [{ consonant: "y" }],
              main: { consonant: "r" },
              post: [{ glide: "u", vowel: "a", coda: "u" }],
            }),
          ],
        ])
      })

      it("handles multiple prefixes correctly", function () {
        const source = "4oquV"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({
              pre: [{ consonant: "" }, { vowel: "oo" }],
              main: { consonant: "q" },
              post: [{ glide: "u", vowel: "e", coda: "i" }],
            }),
          ],
        ])
      })

      it("handles vowelless characters correctly", function () {
        const source = "wup"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({
              pre: [],
              main: { consonant: "v" },
              post: [{ glide: "u" }, { consonant: "p" }],
            }),
          ],
        ])
      })

      it("should not treat i1, iE, u1, uA as valid finals", function () {
        const source = "4i1 4iE 4iA 4u1 4uE 4uA"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i" }, {}],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i" }, { vowel: "ii" }],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i", vowel: "uu" }],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u" }, {}],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u", vowel: "ii" }],
            }),
          ],
          [
            Sub({
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u" }, { vowel: "uu" }],
            }),
          ],
        ])
      })
    })
  })
})
