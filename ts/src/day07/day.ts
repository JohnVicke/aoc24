import { ResultAsync } from "neverthrow"
import { submit } from "../submit"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}

interface Equation {
  value: number
  numbers: number[]
}

function parseInput(data: string[]) {
  return data.reduce((acc, row) => {
    const [value, numbers] = row.split(":")
    acc.push({
      value: parseInt(value),
      numbers: numbers.trim().split(" ").map(n => parseInt(n))
    })
    return acc
  }, [] as Equation[])
}


const Operators = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
  concatenate: (a: number, b: number) => parseInt(`${a}${b}`)
}

type OperatorFunction = typeof Operators[keyof typeof Operators]

function solveEquations(
  equations: Equation[],
  operatorSet: OperatorFunction[],
): number {
  function generateOperatorCombinations(length: number): number[][] {
    const combinations: number[][] = []

    function generateCombos(current: number[], depth: number) {
      if (depth === length) {
        combinations.push([...current])
        return
      }

      for (let op = 0; op < operatorSet.length; op++) {
        current.push(op)
        generateCombos(current, depth + 1)
        current.pop()
      }
    }

    generateCombos([], 0)
    return combinations
  }

  function evaluateEquation(numbers: number[], operatorIndices: number[]): number {
    let result = numbers[0]

    for (let i = 1; i < numbers.length; i++) {
      result = operatorSet[operatorIndices[i - 1]](result, numbers[i])
    }

    return result
  }

  function isValidEquation(equation: Equation): boolean {
    const { value, numbers } = equation

    if (numbers.length === 1) {
      return numbers[0] === value
    }

    if (numbers.length === 2) {
      return operatorSet.some(op => op(numbers[0], numbers[1]) === value)
    }

    const operatorCombos = generateOperatorCombinations(numbers.length - 1)

    return operatorCombos.some(operators =>
      evaluateEquation(numbers, operators) === value
    )
  }

  const valid = equations.filter(isValidEquation)
  return valid.reduce((sum, { value }) => sum + value, 0)
}



export namespace Part1 {
  export const testResult = 3749

  export function run(fileName: InputFile) {
    return readFile(fileName)
      .map(parseInput)
      .map(equations => solveEquations(
        equations,
        [Operators.add, Operators.multiply]
      ))
  }

}


export namespace Part2 {
  export const testResult = 11387

  export function run(fileName: InputFile) {
    return readFile(fileName)
      .map(parseInput)
      .map(equations => solveEquations(
        equations,
        [Operators.add, Operators.multiply, Operators.concatenate]
      ))
  }
}


if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  console.log({ testResult1 })
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
    await submit({ day: 7, part: 1, answer: result })
  }


  const testResult2 = (await Part2.run("test-input"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
    await submit({ day: 7, part: 2, answer: result })
  }
}
