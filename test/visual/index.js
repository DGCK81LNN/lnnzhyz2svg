const fs = require("node:fs/promises")
const http = require("node:http")
const os = require("node:os")
const path = require("node:path")
const util = require("node:util")
const Mustache = require("mustache")
const { parseSVG } = require("svg-path-parser")
const { draw } = require("../../src")
const { serializeText, deserializeText } = require("../../src/notation")
const { ec, getPathD, tS, sthToDraw } = require("../utils")

const args = util.parseArgs({
  options: {
    port: {
      type: "string",
      short: "p",
    },
  },
})

const port = Number(args.values.port || 57813)

function errHTML(error) {
  return (
    '<pre style="color: red; font-size: 1rem; white-space: pre-wrap"><samp>' +
    tS`${error}\n${error?.cause && `    ${error.cause}`}`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;") +
    "</samp></pre>"
  )
}

function renderText(text) {
  const strText = typeof text === "string" ? text : serializeText(text)
  let result = ""
  let error = null
  let msg = "Failed to draw text {text}"
  let d = ""
  try {
    if (typeof text === "string") text = deserializeText(text)
    result = draw(text)
    msg = "Cannot find path in result of drawing text {text}"
    d = getPathD(result)
    msg = "Invalid SVG path {d} generated for text {text}"
    parseSVG(d)
  } catch (err) {
    error = ec(
      msg
        .replace("{text}", JSON.stringify(strText))
        .replace("{d}", JSON.stringify(d)),
      err
    )
    console.dir(error, { depth: 0 })
  }
  return {
    text: strText,
    result,
    error: error ? errHTML(error) : "",
  }
}

async function run() {
  return Array.from(sthToDraw.words(), word => renderText([word]))
}

run().then(results => {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://0.0.0.0")

    if (url.pathname === "/draw") {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json; encoding=utf-8")
      res.end(
        JSON.stringify(renderText(decodeURIComponent(url.search.slice(1))))
      )
      return
    }

    if (url.pathname === "/script.js") {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/javascript; encoding=utf-8")
      res.end(await fs.readFile(path.join(__dirname, "browser.js")))
      return
    }

    if (url.pathname !== "/") {
      res.statusCode = 404
      res.end()
      return
    }

    let html = ""
    try {
      const template = (
        await fs.readFile(path.join(__dirname, "index.html.mustache"))
      ).toString()
      html = Mustache.render(template, { results })
    } catch (err) {
      res.statusCode = 500
      res.setHeader("Content-Type", "text/plain; encoding=utf-8")
      res.end(util.inspect(err))
      console.log(err)
      return
    }
    res.statusCode = 200
    res.setHeader("Content-Type", "text/html; encoding=utf-8")
    res.end(html)
  })

  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
    try {
      console.log(`    http://${os.hostname()}:${port}`)
    } catch {}
    Object.values(os.networkInterfaces()).forEach(interf => {
      interf.forEach(addr => {
        if (addr.family === "IPv4")
          console.log(`    http://${addr.address}:${port}`)
      })
    })
  })
})
