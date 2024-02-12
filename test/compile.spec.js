const { expect } = require("earl")
const { compileMandarin, compileShidinn } = require("..")

describe("compile", function () {
  describe("mandarin", function () {
    describe("compileMandarin()", function () {
      it("compiles a piece of mandarin text", function () {
        const source = "^zhung1_hua2_y3_z4"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            {
              proper: true,
              main: { consonant: "zh" },
              pre: [],
              post: [{ glide: "u", vowel: "e", coda: "ng" }],
            },
            {
              main: { consonant: "h" },
              pre: [{ glide: "u", vowel: "a" }],
              post: [],
            },
            {
              main: { consonant: "" },
              pre: [{ glide: "y", reversed: true }],
              post: [],
            },
            {
              main: { consonant: "z" },
              pre: [],
              post: [{ reversed: true }],
            },
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
            {
              main: { consonant: "h" },
              pre: [],
              post: [{ consonant: "m" }],
            },
          ],
          [
            {
              main: { consonant: "h" },
              pre: [],
              post: [{ consonant: "" }],
            },
          ],

          // ng
          [{ main: { consonant: "" }, pre: [], post: [{}] }],

          // iung
          [
            {
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "y", vowel: "e", coda: "ng" }],
            },
          ],

          //eh
          [{ main: { consonant: "" }, pre: [], post: [{ vowel: "eh" }] }],

          // o ong ou uo bo hong hou
          [{ main: { consonant: "" }, pre: [], post: [{ vowel: "o" }] }],
          [
            {
              main: { consonant: "" },
              pre: [],
              post: [{ vowel: "o", coda: "ng" }],
            },
          ],
          [
            {
              main: { consonant: "" },
              pre: [],
              post: [{ vowel: "e", coda: "u" }],
            },
          ],
          [
            {
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "u", vowel: "e" }],
            },
          ],
          [
            {
              main: { consonant: "b" },
              pre: [],
              post: [{ glide: "u", vowel: "e" }],
            },
          ],
          [
            {
              main: { consonant: "h" },
              pre: [],
              post: [{ glide: "u", vowel: "e", coda: "ng" }],
            },
          ],
          [
            {
              main: { consonant: "h" },
              pre: [],
              post: [{ vowel: "e", coda: "u" }],
            },
          ],
        ])
      })

      it("recognises letterals", function () {
        const source = "8_1 ^L_^N_^N Xa"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            { main: { consonant: "8" }, pre: [], post: [] },
            { main: { consonant: "1" }, pre: [], post: [] },
          ],
          [
            { proper: true, main: { consonant: "l" }, pre: [], post: [] },
            { proper: true, main: { consonant: "n" }, pre: [], post: [] },
            { proper: true, main: { consonant: "n" }, pre: [], post: [] },
          ],
          [{ main: { consonant: "xa" }, pre: [], post: [] }],
        ])
      })

      it("recognises hyphens", function () {
        const source = "i1_xin1-i1_i4"
        const result = compileMandarin(source)

        expect(result).toEqual([
          [
            {
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i" }],
            },
            {
              main: { consonant: "x" },
              pre: [],
              post: [{ glide: "i", vowel: "e", coda: "n" }],
            },
            {
              hyphen: true,
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i" }],
            },
            {
              main: { consonant: "" },
              pre: [],
              post: [{ glide: "i", reversed: true }],
            },
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
      })

      it("compiles a slightly more complex piece of shidinn text", function () {
        const source = "yy8i_xho_kD3H t38_gzoT xd8"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            {
              pre: [{ consonant: "yj" }],
              main: { consonant: "yj" },
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
        ])
      })

      it("recognizes hyphens", function () {
        const source = "3-yruL"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            { pre: [], main: { vowel: "e", coda: "n" }, post: [] },
            {
              hyphen: true,
              pre: [{ consonant: "yj" }],
              main: { consonant: "rz" },
              post: [{ glide: "u", vowel: "a", coda: "u" }],
            },
          ],
        ])
      })

      it("handles multiple prefixes correctly", function () {
        const source = "4oquV"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            {
              pre: [{ consonant: "" }, { vowel: "oo" }],
              main: { consonant: "q" },
              post: [{ glide: "u", vowel: "e", coda: "i" }],
            },
          ],
        ])
      })

      it("handles vowelless characters correctly", function () {
        const source = "wup"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            {
              pre: [],
              main: { consonant: "v" },
              post: [{ glide: "u" }, { consonant: "p" }],
            },
          ],
        ])
      })

      it("should not treat i1, iE, u1, uA as valid finals", function () {
        const source = "4i1 4iE 4iA 4u1 4uE 4uA"
        const result = compileShidinn(source)

        expect(result).toEqual([
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i" }, {}],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i" }, { vowel: "ii" }],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "i", vowel: "uu" }],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u" }, {}],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u", vowel: "ii" }],
            },
          ],
          [
            {
              pre: [],
              main: { consonant: "" },
              post: [{ glide: "u" }, { vowel: "uu" }],
            },
          ],
        ])
      })
    })
  })
})
