import { ResultAsync } from "neverthrow"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}

function parseInput(data: string[]) {
  return data.reduce((acc, row) => {
    const [a, b] = row.split(" " + " " + " ").map(Number)
    acc[0].push(a)
    acc[1].push(b)
    return acc
  }, [[], []] as [number[], number[]])
}

export namespace Part1 {
  export const testResult = 11

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map((arrs) => {
      const [a, b] = arrs.map(a => a.sort())
      return a.reduce((acc, left, i) => {
        const right = b[i]
        return acc + Math.abs(left - right)
      }, 0)
    })
  }

}

export namespace Part2 {
  export const testResult = 31

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map((arrs) => {
      const [a, b] = arrs

      return a.reduce((acc, left) => {
        const occurancesInRight = b.filter((v) => v === left).length ?? 0
        return acc + (left * occurancesInRight)
      }, 0)
    })
  }
}

if (process.env.NODE_ENV !== "test") {
  await Part1.run("input").match(
    console.info,
    console.error
  )


  await Part2.run("input").match(
    console.info,
    console.error
  )
}
