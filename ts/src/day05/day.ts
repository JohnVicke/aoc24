import { ResultAsync } from "neverthrow"
import { submit } from "../submit"
import path from "path"

type InputFile = "test-input" | "input"

function readFile(fileName: InputFile) {
  return ResultAsync.fromSafePromise(Bun.file(path.join(import.meta.dir, fileName)).text()).map(t => t.trim().split("\n"))
}

function parseInput(data: string[]) {
  const index = data.findIndex((line) => line === "")

  const rules = data.slice(0, index).reduce((ruleMap, line) => {
    const [before, after] = line.split("|").map(Number);

    if (!ruleMap.has(before)) {
      ruleMap.set(before, []);
    }
    ruleMap.get(before)!.push(after);

    return ruleMap;
  }, new Map<number, number[]>());

  const updates = data.slice(index + 1).map(line => line.split(",").map(Number));

  return {
    rules, updates
  }
}

function isUpdateValid(rules: Map<number, number[]>, update: number[]): boolean {
  const pagePositions = new Map(update.map((page, index) => [page, index]));

  return Array.from(rules.entries()).every(([before, afters]) => {
    const validAfters = afters.filter(after => pagePositions.has(after));

    return validAfters.every(after => {
      if (!pagePositions.has(before) || !pagePositions.has(after)) {
        return true;
      }
      return pagePositions.get(before)! < pagePositions.get(after)!;
    });
  });
}

function middlePage(update: number[]): number {
  return update[Math.floor(update.length / 2)];
}

function sum(sum: number, page: number) {
  return sum + page;
}

export namespace Part1 {
  export const testResult = 143

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map(({ rules, updates }) => {
      return updates.filter(update => isUpdateValid(rules, update)).map(middlePage).reduce(sum, 0);
    })
  }

}

export namespace Part2 {
  export const testResult = 123

  export function run(fileName: InputFile) {
    return readFile(fileName).map(parseInput).map(({ rules, updates }) => {
      return updates.filter(update => !isUpdateValid(rules, update)).map(update => {
        return Array.from(update).sort((a, b) => {
          const afterA = rules.get(a) || [];
          const afterB = rules.get(b) || [];

          if (afterA.includes(b)) return -1;
          if (afterB.includes(a)) return 1;

          return 0
        })
      }).map(middlePage).reduce(sum, 0);
    })
  }
}

if (process.env.NODE_ENV !== "test") {
  const testResult1 = (await Part1.run("test-input"))._unsafeUnwrap()
  if (testResult1 === Part1.testResult) {
    const result = (await Part1.run("input"))._unsafeUnwrap()
    console.log({ part1: result })
    await submit({ day: 5, part: 1, answer: result })
  }


  const testResult2 = (await Part2.run("test-input"))._unsafeUnwrap()
  if (testResult2 === Part2.testResult) {
    const result = (await Part2.run("input"))._unsafeUnwrap()
    console.log({ part2: result })
    await submit({ day: 5, part: 2, answer: result })
  }
}
