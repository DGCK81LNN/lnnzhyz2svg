const { drawMandarin, drawShidinn } = require("../src")

class Demo {
  constructor(inputbox, out, fn) {
    this.inputbox = inputbox
    this.out = out
    this.inputbox.oninput = () => {
      this.error = null
      try {
        out.innerHTML = fn(inputbox.value || inputbox.placeholder)
      } catch (error) {
        this.error = error
      }
    }
    this.inputbox.onblur = () => {
      if (this.error) out.innerText = this.error
    }

    try {
      out.innerHTML = fn(inputbox.value || inputbox.placeholder)
    } catch (error) {
      out.innerText = error
    }
  }
}

new Demo(
  document.getElementById("inputbox-mandarin"),
  document.getElementById("out-mandarin"),
  text => '<p style="font-size: 2rem">' + drawMandarin(text) + "</p>"
)
new Demo(
  document.getElementById("inputbox-shidinn"),
  document.getElementById("out-shidinn"),
  text => '<p style="font-size: 2rem">' + drawShidinn(text) + "</p>"
)
