/** @type {?AbortController} */
let aborter = null

document.querySelector("#live-input").onblur = function () {
  if (!this.value) return
  aborter?.abort("cancel")
  aborter = new AbortController()
  fetch("/draw?" + encodeURIComponent(this.value), { signal: aborter.signal })
    .then(async response => {
      const { result, error } = await response.json()
      document.querySelector("#live-output").innerHTML = result + error
    })
    .catch(err => {
      if (err === "cancel") return
      alert(`Failed to render live preview: ${err}`)
      console.error(err)
    })
}
