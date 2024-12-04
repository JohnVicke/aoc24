import { ResultAsync } from "neverthrow"
import { submit } from "../submit"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}


export namespace Part1 {
  const XMAS = "XMAS" as const

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1],
  ] satisfies [number, number][]
  export const testResult = 18

  export function run(fileName: InputFile) {
    return readFile(fileName).map((grid) => {
      return grid.reduce((total, row, rowIndex) => {
        const cols = Array.from(row)
        const totalMatches = cols.reduce((rowTotal, _, colIndex) => {
          return rowTotal + directions.reduce((count, [dx, dy]) => {
            for (let i = 0; i < XMAS.length; i++) {
              const x = rowIndex + i * dx
              const y = colIndex + i * dy

              if (x < 0 || x >= row.length || y < 0 || y >= cols.length) {
                return count
              }

              if (grid[x][y] !== XMAS[i]) {
                return count
              }

            }
            return count + 1
          }, 0)

        }, 0)

        return total + totalMatches
      }, 0)
    })
  }

}

export namespace Part2 {
  export const testResult = 9

  const leftDiag = [
    [-1, -1],
    [1, 1],
  ] satisfies [number, number][]

  const rightDiag = [
    [-1, 1],
    [1, -1],
  ] satisfies [number, number][]

  function completesMAS(letters: string) {
    return /\b(SM|MS)\b/.test(letters)
  }

  export function run(fileName: InputFile) {
    return readFile(fileName).map((grid) => {
      return grid.reduce((total, row, rowIndex) => {
        const cols = Array.from(row)
        const totalMatches = cols.reduce((rowTotal, col, colIndex) => {
          if (col !== "A") {
            return rowTotal
          }

          const getDiagLetters = (dir: [number, number][]) => {
            return dir.reduce((word, [dx, dy]) => {
              const x = rowIndex + dx
              const y = colIndex + dy

              if (x < 0 || x >= row.length || y < 0 || y >= cols.length) {
                return word
              }

              return word + grid[x][y]

            }, "")
          }

          const leftLetters = getDiagLetters(leftDiag)
          const rightLetters = getDiagLetters(rightDiag)

          if (!completesMAS(leftLetters) || !completesMAS(rightLetters)) {
            return rowTotal
          }


          return rowTotal + 1
        }, 0)

        return total + totalMatches
      }, 0)
    })
  }
}

if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
    await submit({ day: 4, part: 1, answer: result })
  }


  const testResult2 = (await Part2.run("test-input"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
    await submit({ day: 4, part: 2, answer: result })
  }
}
