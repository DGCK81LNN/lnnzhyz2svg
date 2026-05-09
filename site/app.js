const { drawMandarin, drawShidinn, draw, PUA } = require("../src")

class Demo {
  constructor(inputbox, out, fn, { whole = false, charPattern = "[\\dA-Za-z]+" } = {}) {
    this.inputbox = inputbox
    this.out = out
    this.fn = fn
    this.wordRegex = !whole && new RegExp(String.raw`\^?${charPattern}(?:[ _\-]\^?${charPattern})*`, "g")

    this.inputbox.oninput = () => {
      this.error = null
      try {
        this.update()
      } catch (error) {
        this.error = error
      }
    }
    this.inputbox.onblur = () => {
      if (this.error) out.innerText = this.error
    }

    try {
      this.update()
    } catch (error) {
      out.innerText = error
      console.error(error)
    }
  }

  update() {
    let text = this.inputbox.value || this.inputbox.placeholder
    if (this.wordRegex) {
      text = text.replace(/[\ufdd0\ufdd1]/g, "\ufffd").replace(/</g, "\ufdd0").replace(/&/g, "\ufdd1")
      text = text.replace(this.wordRegex, this.fn)
      text = text.replace(/\ufdd0/g, "&lt;").replace(/\ufdd1/g, "&amp;")
    } else {
      text = this.fn(text)
    }
    this.out.innerHTML = text
  }
}

new Demo(
  document.getElementById("inputbox-mandarin"),
  document.getElementById("out-mandarin"),
  text => drawMandarin(text)
)
new Demo(
  document.getElementById("inputbox-shidinn"),
  document.getElementById("out-shidinn"),
  text => drawShidinn(text),
  { charPattern: "[\\dA-Za-z]+(?:'[\\dA-Za-z]+)*" }
)
new Demo(
  document.getElementById("inputbox-pua"),
  document.getElementById("out-pua"),
  text => {
    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    let segments = []
    for (const item of PUA.parseMixed(text)) {
      if (typeof item === "string") {
        segments.push(item)
      } else if (segments[segments.length - 1] === "\u200c" && Array.isArray(segments[segments.length - 2])) {
        segments[segments.length - 2].push(item)
        segments.pop()
      } else {
        segments.push([item])
      }
    }
    return segments.map(s => typeof s === "string" ? s : draw(s)).join("")
  },
  { whole: true }
)
