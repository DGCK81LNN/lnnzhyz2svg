const { expect } = require("earl")
const { PUA } = require("../src")

describe("pua", function () {
  describe("stringifyCharacter()", function () {
    it("translates a Character into PUA encoding", function () {
      expect(
        PUA.stringifyCharacter({
          pre: [{ consonant: "x" }],
          main: { consonant: "d" },
          post: [{ glide: "i", vowel: "e", coda: "n" }],
        })
      ).toEqual("\ue19d\ue055\ue0d4")
    })

    it("supports mandarin option", function () {
      expect(
        PUA.stringifyCharacter(
          {
            main: { consonant: "h" },
            pre: [],
            post: [{ consonant: "w" }],
          },
          { mandarin: true }
        )
      ).toEqual("\ue05b\ue081")
    })

    it("throws on unencoded elements")
  })

  describe("stringifyText()", function () {
    it("translates CompiledText into PUA encoding", function () {
      expect(
        PUA.stringifyText([
          [
            {
              main: { consonant: "x" },
              pre: [],
              post: [{ glide: "i" }],
            },
            {
              main: { consonant: "d" },
              pre: [{ glide: "i", vowel: "e", coda: "ng", reversed: true }],
              post: [],
            },
            {
              proper: true,
              pre: [{ consonant: "x" }],
              main: { consonant: "d" },
              post: [{ glide: "i", vowel: "e", coda: "n" }],
            },
          ],
          [
            {
              main: { vowel: "a" },
              pre: [],
              post: [],
            },
            {
              main: { consonant: "h" },
              pre: [],
              post: [],
            },
            {
              main: { vowel: "oo" },
              pre: [],
              post: [],
            },
            {
              hyphen: true,
              main: { modifier: "rr" },
              pre: [],
              post: [],
            },
          ],
          [
            {
              main: { consonant: "7" },
              pre: [],
              post: [],
            },
          ],
        ])
      ).toEqual(
        "\ue05e\ue0c4\ue0da\ue055\ue06f\ue19d\ue055\ue0d4 \ue06b\ue05b\ue180\ue06e\ue06d \ue047"
      )
    })

    it("supports mandarin option", function () {
      expect(
        PUA.stringifyText(
          [
            [
              {
                main: { consonant: "x" },
                pre: [],
                post: [{ glide: "i" }],
              },
              {
                main: { consonant: "d" },
                pre: [{ glide: "i", vowel: "e", coda: "ng", reversed: true }],
                post: [],
              },
            ],
          ],
          { mandarin: true }
        )
      ).toEqual("\ue05e\ue070\ue074\ue055\ue072\ue074\ue077\ue07e")
    })
  })

  describe("parseCharacter()", function () {
    it("parses a PUA encoded character at the beginning of the string", function () {
      expect(
        PUA.parseCharacter(
          "\ue05c\ue071\ue076\ue077\ue055\ue073\ue074\ue077\ue07e"
        )
      ).toEqual({
        character: {
          main: { consonant: "j" },
          post: [],
          pre: [{ glide: "y", vowel: "e" }],
        },
        source: "\ue05c\ue071\ue076\ue077",
      })
    })

    it("throws on invalid sequences", function () {
      expect(() => PUA.parseCharacter("\ue090")).toThrow(
        PUA.ParseError,
        "Unexpected E090, expected letter"
      )
      expect(() => PUA.parseCharacter("\ue091")).toThrow(
        PUA.ParseError,
        "Unexpected EOF, expected consonant letter"
      )
      expect(() => PUA.parseCharacter("\ue092\ue090")).toThrow(
        PUA.ParseError,
        "Unexpected E090, expected consonant letter"
      )
    })
  })

  describe("parseMixed()", function () {
    it("parses all valid PUA sequences", function () {
      expect(
        PUA.parseMixed(
          "\ue06f\ue064\ue098\ue176\ue0cc \ue170\ue1d0\ue171\ue0bc " +
            "\ue06f\ue067\ue065\ue06a\ue05a\ue067\ue06e\ue05d\ue0bc，" +
            "你家 \ue05f\ue073\ue078\ue059\ue073\ue075\ue077\ue07b " +
            "\ue05f\ue073\ue078 的成"
        )
      ).toMatchSnapshot(this)
    })
  })
})
