const Mocha = require("mocha")
const { inspect } = require("node:util")

const fail = Mocha.Runner.prototype.fail
Mocha.Runner.prototype.fail = function (test, err) {
  if (
    err &&
    typeof err.message === "string" &&
    typeof err.stack === "string" &&
    Object.keys(err).length
  ) {
    err = Object.create(err)
    err.stack = inspect(err)
  }
  fail.call(this, test, err)
}
