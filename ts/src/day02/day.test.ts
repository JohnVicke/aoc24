import { describe, it, expect } from "bun:test"
import { Part1, Part2 } from "./day"

describe("day02", () => {
  describe("part 1", () => {
    it("should solve test input", async () => {
      const result = (await Part1.run("test-input"))._unsafeUnwrap()
      expect(result).toEqual(Part1.testResult)
    })
    it("should solve real input input", async () => {
      const result = (await Part1.run("input"))._unsafeUnwrap()
      console.log({ part1: result })
      expect(result).toBeDefined()
    })
  })
  describe("part 2", () => {
    it("should solve test input", async () => {
      const result = (await Part2.run("test-input"))._unsafeUnwrap()
      expect(result).toEqual(Part2.testResult)
    })

    it("should solve real input", async () => {
      const result = (await Part2.run("input"))._unsafeUnwrap()
      console.log({ part2: result })
      expect(result).toBeDefined()
    })
  })
})
