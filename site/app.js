const { drawMandarin, drawShidinn } = require("../src")

class Demo {
  constructor(inputbox, out, fn) {
    this.inputbox = inputbox
    this.out = out
    this.fn = fn

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
    text = text.replace(/[\ufdd0-\ufdef]/, "\ufffd").replace(/</g, "\ufdd0")
    text = text.replace(/[\^]?\w+(?:[ _\-][\^]?\w+)*/g, this.fn)
    text = text.replace(/\ufdd0/g, "&lt;").replace(/\n/g, "<br>")
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
  text => drawShidinn(text)
)
