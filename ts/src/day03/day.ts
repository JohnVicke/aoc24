import { ResultAsync } from "neverthrow"
import path from "path"

type InputFile = "test-input" | "input" | "test-input-2"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim())
}

type ProgState = "do()" | "don't()"

interface Mul {
  a: number
  b: number
}

function matchProg(prog: string) {
  return prog.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g);
}


function mulStringToMul(s: string) {
  const mul = s.match(/\d{1,3}/g)
  return { a: parseInt(mul!.at(0)!), b: parseInt(mul!.at(1)!) } satisfies Mul
}

function isDoOrDont(s: string): s is ProgState {
  return s === "do()" || s === "don't()"
}

export namespace Part1 {
  export const testResult = 161

  export function run(fileName: InputFile) {
    return readFile(fileName).map(matchProg).map(reg => {
      return reg?.reduce((acc, curr) => {
        const mul = isDoOrDont(curr) ? { a: 0, b: 0 } : mulStringToMul(curr)
        return acc + (mul.a * mul.b)
      }, 0)
    })
  }

}

export namespace Part2 {
  export const testResult = 48

  export function run(fileName: InputFile) {
    return readFile(fileName).map(matchProg).map((reg) => {
      return reg?.reduce((acc, curr) => {
        if (isDoOrDont(curr)) {
          acc.state = curr
          return acc
        }

        const mul = mulStringToMul(curr)
        acc.sum += acc.state === "do()" ? mul.a * mul.b : 0
        return acc
      }, { sum: 0, state: "do()" } as { sum: number, state: ProgState }).sum
    })
  }
}

if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
  }


  const testResult2 = (await Part2.run("test-input-2"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
  }
}
