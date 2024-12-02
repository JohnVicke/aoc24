import { err, ok, ResultAsync } from "neverthrow";

export function submit(args: { day: number, part: 1 | 2, answer: number | string }) {
  const formdata = new FormData()
  formdata.set("level", args.part.toString())
  formdata.set("answer", args.answer.toString())

  return ResultAsync.fromPromise(fetch(`https://adventofcode.com/2024/day/${args.day}/answer`, {
    method: "POST",
    headers: {
      Cookie: `session=${process.env.AOC_SESSION}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formdata
  }), err => err).andThen(res => {
    if (!res.ok) {
      return err("fetch_failed" as const)
    }

    return ok(`https://adventofcode.com/2024/day/${args.day}/answer`)
  })
}
