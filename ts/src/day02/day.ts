import { ResultAsync } from "neverthrow"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}

function parseInput(data: string[]) {
  return data
}

function isSafe(arr: number[]): boolean {
  const isAscending = arr.every((val, i, arr) =>
    i === 0 || (val !== arr[i - 1] && (val >= arr[i - 1] && Math.abs(val - arr[i - 1]) <= 3))
  )

  const isDescending = arr.every((val, i, arr) =>
    i === 0 || ((val !== arr[i - 1] && val <= arr[i - 1] && Math.abs(val - arr[i - 1]) <= 3))
  )

  return isAscending || isDescending
}


export namespace Part1 {
  export const testResult = 2

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map((arrs) => {
      return arrs.reduce((acc, curr) => {
        const v = curr.split(" ").map(Number)
        return isSafe(v) ? acc + 1 : acc
      }, 0)

    })
  }

}

export namespace Part2 {
  export const testResult = 4

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map((arrs) => {
      return arrs.reduce((acc, curr) => {
        const v = curr.split(" ").map(Number)

        if (isSafe(v)) {
          return acc + 1
        }

        for (let i = 0; i < v.length; i++) {
          const modifiedArr = [...v.slice(0, i), ...v.slice(i + 1)]
          if (isSafe(modifiedArr)) {
            return acc + 1
          }
        }

        return acc

      }, 0)
    })
  }
}

if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
  }


  const testResult2 = (await Part2.run("test-input"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
  }
}
