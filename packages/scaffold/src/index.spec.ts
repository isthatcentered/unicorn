import * as R from "fp-ts/lib/ReaderTaskEither"
import { pipe } from "fp-ts/lib/pipeable"
import { always, merge } from "ramda"
import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { equals, fails } from "./tests.utils"

function importLib(env: "prod" | "dev" = "dev") {
	return env === "prod" ? require("../.") : require("./index.ts")
}

const _lib = importLib("dev") // will not work with async

test(`I can construct "config" from prompt and env config`, async () => {
	const answers = {
		name: "John",
		familyName: "Rambo",
	}

	const fixedConfig = { admin: true }

	const getAnswers: TE.TaskEither<string, typeof answers> = TE.right(answers)

	const processData = pipe(
		R.right<typeof answers & { admin: boolean }, string, void>(undefined),
		R.chain(always(R.ask())),
		// R.map(log("blah")),
	)

	const app = pipe(
		getAnswers,
		TE.map(merge(fixedConfig)),
		TE.chain(processData),
	)

	const res = await app()

	pipe(
		res,
		E.fold(fails, equals(merge(fixedConfig, answers))),
	)
})
