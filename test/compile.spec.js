const { expect } = require("chai")
const { compileMandarin, compileShidinn } = require("../src/compile")

describe("compile", function () {
  describe("mandarin", function () {
    describe("compileMandarin()", function () {
      it("compiles a piece of mandarin text", function () {
        const source = "^zhung1_hua2_y3_z4"
        const result = compileMandarin(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{proper:true,main:{consonant:"zh"},pre:[],post:[{glide:"u",vowel:"e",coda:"ng"}],reverseAffixes:false},{main:{consonant:"h"},pre:[{glide:"u",vowel:"a"}],post:[],reverseAffixes:false},{main:{consonant:""},pre:[{glide:"y"}],post:[],reverseAffixes:true},{main:{consonant:"z"},pre:[],post:[{}],reverseAffixes:true}]]
        expect(result).to.deep.equal(expected)
      })

      it("handles special spellings and special syllables", function () {
        const source = "hm hng   ng1   iung1   eh1   o1 ong1 ou1 uo1 bo1 hong1 hou1"
        const result = compileMandarin(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */
          [
            [{main:{consonant:"h"},pre:[],post:[{consonant:"m"}]}],
            [{main:{consonant:"h"},pre:[],post:[{consonant:""}]}],

            [{main:{consonant:""},pre:[],post:[{}],reverseAffixes:false}],

            [{main:{consonant:""},pre:[],post:[{glide:"y",vowel:"e",coda:"ng"}],reverseAffixes:false}],

            [{main:{consonant:""},pre:[],post:[{vowel:"eh"}],reverseAffixes:false}],

            [{main:{consonant:""},pre:[],post:[{vowel:"o"}],reverseAffixes:false}],
            [{main:{consonant:""},pre:[],post:[{vowel:"o",coda:"ng"}],reverseAffixes:false}],
            [{main:{consonant:""},pre:[],post:[{vowel:"e",coda:"u"}],reverseAffixes:false}],
            [{main:{consonant:""},pre:[],post:[{glide:"u",vowel:"e"}],reverseAffixes:false}],
            [{main:{consonant:"b"},pre:[],post:[{glide:"u",vowel:"e"}],reverseAffixes:false}],
            [{main:{consonant:"h"},pre:[],post:[{glide:"u",vowel:"e",coda:"ng"}],reverseAffixes:false}],
            [{main:{consonant:"h"},pre:[],post:[{vowel:"e",coda:"u"}],reverseAffixes:false}],
          ]
        expect(result).to.deep.equal(expected)
      })

      it("recognises letterals", function () {
        const source = "8_1 ^L_^N_^N Xa"
        const result = compileMandarin(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */
          [
            [{main:{consonant:"8"},pre:[],post:[]},{main:{consonant:"1"},pre:[],post:[]}],
            [{proper:true,main:{consonant:"l"},pre:[],post:[]},{proper:true,main:{consonant:"n"},pre:[],post:[]},{proper:true,main:{consonant:"n"},pre:[],post:[]}],
            [{main:{consonant:"xa"},pre:[],post:[]}],
          ]
        expect(result).to.deep.equal(expected)
      })

      it("recognises hyphens", function () {
        const source = "i1_xin1-i1_i4"
        const result = compileMandarin(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{main:{consonant:""},pre:[],post:[{glide:"i"}],reverseAffixes:false},{main:{consonant:"x"},pre:[],post:[{glide:"i",vowel:"e",coda:"n"}],reverseAffixes:false},{hyphen:true,main:{consonant:""},pre:[],post:[{glide:"i"}],reverseAffixes:false},{main:{consonant:""},pre:[],post:[{glide:"i"}],reverseAffixes:true}]]
        expect(result).to.deep.equal(expected)
      })
    })
  })

  describe("shidinn", function () {
    describe("compileShidinn()", function () {
      it("compiles a piece of shidinn text", function () {
        const source = "Vnu8_AHL ^xdi8_aho"
        const result = compileShidinn(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{pre:[{vowel:"e",coda:"i"}],main:{consonant:"nj"},post:[{glide:"u",vowel:"e",coda:"ng"}]},{pre:[{vowel:"uu"}],main:{consonant:"nz"},post:[{vowel:"a",coda:"u"}]}],[{proper:true,pre:[{consonant:"x"}],main:{consonant:"d"},post:[{glide:"i",vowel:"e",coda:"ng"}]},{pre:[{vowel:"a"}],main:{consonant:"h"},post:[{vowel:"oo"}]}]]
        expect(result).to.deep.equal(expected)
      })

      it("compiles a slightly more complex piece of shidinn text", function () {
        const source = "yy8i_xho_kD3H t38_gzoT xd8"
        const result = compileShidinn(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{pre:[{consonant:"y"}],main:{consonant:"y"},post:[{vowel:"e",coda:"ng"},{glide:"i"}]},{pre:[{consonant:"x"}],main:{consonant:"h"},post:[{vowel:"oo"}]},{pre:[{consonant:"k"}],main:{consonant:"c"},post:[{vowel:"e",coda:"n"},{consonant:"nz"}]}],[{pre:[],main:{consonant:"t"},post:[{vowel:"e",coda:"n"},{vowel:"e",coda:"ng"}]},{pre:[{consonant:"g"}],main:{consonant:"z"},post:[{vowel:"oo"},{vowel:"a",coda:"ng"}]}],[{pre:[{consonant:"x"}],main:{consonant:"d"},post:[{vowel:"e",coda:"ng"}]}]]
        expect(result).to.deep.equal(expected)
      })

      it("recognizes hyphens", function () {
        const source = "3-yruL"
        const result = compileShidinn(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{pre:[],main:{vowel:"e",coda:"n"},post:[]},{hyphen:true,pre:[{consonant:"y"}],main:{consonant:"r"},post:[{glide:"u",vowel:"a",coda:"u"}]}]]
        expect(result).to.deep.equal(expected)
      })

      it("handles multiple prefixes correctly", function () {
        const source = "4oquV"
        const result = compileShidinn(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{pre:[{consonant:""},{vowel:"oo"}],main:{consonant:"q"},post:[{glide:"u",vowel:"e",coda:"i"}]}]]
        expect(result).to.deep.equal(expected)
      })

      it("handles vowelless characters correctly", function () {
        const source = "wup"
        const result = compileShidinn(source)

        /** @type {import("../src/types").CompiledText} */
        const expected =
          /* prettier-ignore */ [[{pre:[],main:{consonant:"f"},post:[{glide:"u"},{consonant:"p"}]}]]
        expect(result).to.deep.equal(expected)
      })
    })
  })
})
