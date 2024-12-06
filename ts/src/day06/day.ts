import { ResultAsync } from "neverthrow"
import { submit } from "../submit"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}

function parseGrid(grid: string[]) {
  return grid.map(row => Array.from(row))
}



function printGrid(grid: string[][], guardPos: [number, number], visited: Set<string>) {
  console.clear();

  const gridCopy = grid.map((row, rIdx) =>
    row.map((cell, cIdx) => {
      if (rIdx === guardPos[0] && cIdx === guardPos[1]) {
        return "G"; // Guard's current position
      }
      return visited.has(`${rIdx},${cIdx}`) ? "X" : cell; // Mark visited cells with X
    })
  );

  console.log(gridCopy.map((row) => row.join("")).join("\n"));
}

type Direction = "^" | "v" | ">" | "<"

function move(direction: Direction, position: [number, number]): [number, number] {
  const [row, col] = position;
  switch (direction) {
    case "^": return [row - 1, col];
    case "v": return [row + 1, col];
    case ">": return [row, col + 1];
    case "<": return [row, col - 1];
  }
}


function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "^": return ">"
    case ">": return "v"
    case "v": return "<"
    case "<": return "^"
  }
}

export namespace Part1 {
  export const testResult = 41

  export function run(fileName: InputFile) {

    return readFile(fileName).map(parseGrid).map(async (grid) => {
      const startRow = grid.findIndex((row) => row.includes("^"))
      const startCol = grid[startRow].indexOf("^")

      let direction = "^" as Direction
      let visited = new Set<`${number},${number}`>()
      let position = [startRow, startCol] as [number, number]
      visited.add(`${startRow},${startCol}`)

      while (true) {
        const [nextRow, nextCol] = move(direction, position)

        if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[nextRow].length) {
          break
        }

        if (grid[nextRow][nextCol] === "#") {
          direction = turnRight(direction)
          continue
        }

        position = [nextRow, nextCol]
        visited.add(`${nextRow},${nextCol}`)

        if (process.env.NODE_ENV === "test") {

          printGrid(grid, position, visited);
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

      }

      return visited.size
    })
  }
}

export namespace Part2 {
  export const testResult = -1

  type Visited = `${number},${number},${Direction}`

  export function run(fileName: InputFile) {

    function runSimulation(grid: string[][], position: [number, number], direction: Direction) {
      const visited = new Set<Visited>()
      let pos = position
      let dir = direction


      while (true) {
        const key = `${pos[0]},${pos[1]},${dir}` as Visited

        if (visited.has(key)) {
          return true
        }

        visited.add(key)

        const [nextRow, nextCol] = move(direction, position)

        if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[nextRow].length) {
          break;
        }

        if (grid[nextRow][nextCol] === "#") {
          direction = turnRight(direction)
        }

        pos = [nextRow, nextCol]

      }

      return false
    }

    return readFile(fileName).map(parseGrid).map(async (grid) => {
      const startRow = grid.findIndex((row) => row.includes("^"))
      const startCol = grid[startRow].indexOf("^")

      const direction = "^" as Direction
      const validPositions = new Set<`${number},${number}`>()

      const position = [startRow, startCol] as [number, number]

      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === "#" || (row === startRow && col === startCol)) {
            continue
          }

          grid[row][col] = "#"

          if (runSimulation(grid, position, direction)) {
            validPositions.add(`${row},${col}`)
          }

          grid[row][col] = "."

        }
      }


      return validPositions.size

    })
  }
}

if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
    await submit({ day: 6, part: 1, answer: result })
  }


  const testResult2 = (await Part2.run("test-input"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
    await submit({ day: 6, part: 2, answer: result })
  }
}
