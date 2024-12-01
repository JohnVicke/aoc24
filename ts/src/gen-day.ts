import { err, ok, ResultAsync } from "neverthrow";
import path from "path";
import * as fs from "fs/promises"

const day = Number.parseInt(process.argv[2], 10)

function fileExists(filePath: string) {
  return ResultAsync.fromPromise(
    fs.exists(filePath)
    , _err => "file_exists" as const).andThen(exists => {
      if (exists) {
        return err("file_exists" as const)
      }

      return ok(true)
    })
}

function writeFile(filePath: string, text: string) {
  return ResultAsync.fromPromise(
    Bun.write(filePath, text)
    , _err => "write_file" as const)

}

function getInputPath(type: "src" | "test" | "input" | "test-input", day: number) {
  const fileExt = type === "src" ? ".ts" : type === "test" ? ".test.ts" : ""
  const name = type === "src" || type === "test" ? "day" : type
  return path.join(import.meta.dir, `../src/day${day.toString().padStart(2, "0")}/${name}${fileExt}`)
}

function writeTestInput(day: number) {
  const inputPath = getInputPath("test-input", day)
  return fileExists(inputPath).andThen(() => writeFile(inputPath, "1 2"))
}


function writeInput(day: number) {
  const inputPath = getInputPath("input", day)
  return fileExists(inputPath).andThen(() => fetchInput(day)).andThen((text) => writeFile(inputPath, text))
}

function getTemplate(day: number, type: "src" | "test") {
  return ResultAsync.fromPromise(Bun.file(path.join(import.meta.dir, `../templates/${type}`)).text(), _err => {
    return "get_template" as const
  }).map((t) =>
    t.replaceAll("<day>", `day${day.toString().padStart(2, "0")}`))
}

function writeSrc(day: number) {
  const inputPath = getInputPath("src", day)
  return fileExists(inputPath).andThen(() => getTemplate(day, "src")).andThen((src) => writeFile(inputPath, src))
}

function writeTest(day: number) {
  const inputPath = getInputPath("test", day)
  return fileExists(inputPath).andThen(() => getTemplate(day, "test")).andThen((test) => writeFile(inputPath, test))
}

function writeDay(day: number) {
  return Promise.all([writeInput(day), writeSrc(day), writeTest(day), writeTestInput(day)])
}

export function fetchInput(day: number, year = 2024) {
  return ResultAsync.fromPromise(fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${process.env.AOC_SESSION}`
    }
  }), err => err).andThen(res => {
    if (!res.ok) {
      return err("fetch_failed" as const)
    }

    return ResultAsync.fromSafePromise(res.text())
  })
}


for (const result of await writeDay(day)) {
  result.match(console.info, console.error)
}
