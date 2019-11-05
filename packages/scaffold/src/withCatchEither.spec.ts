import { withCatchEither, withFailureContext } from "./withCatchEither"
import { identity } from "ramda"
import { equals, onLeft, onRight, rejects } from "./tests.utils"
import * as TE from "fp-ts/lib/TaskEither"
import { propAny } from "./random"

describe(`${withCatchEither.name}`, () => {
	test(`Promise resolve returns a right`, async () => {
		const promiseResolve = "promise_resolve",
			sut = withCatchEither(identity)(() => Promise.resolve(promiseResolve)),
			res = await sut()()

		onRight(res, equals(promiseResolve))
	})

	test(`Wrapped function's arguments are preserved`, () => {
		const sut = withCatchEither(identity)((param: string) =>
			Promise.resolve(param),
		)

		sut("param")
	})

	test(`Promise reject returns mapped left`, async () => {
		const extractErrorMessage = propAny<Error>("message"),
			sut = withCatchEither(extractErrorMessage)(
				rejects({ message: "error_message" }),
			),
			res = await sut()()

		onLeft(res, equals("error_message"))
	})
})

describe(`${withFailureContext.name}`, () => {
	test(`Appends the context string to the error message`, async () => {
		const error = "some_error",
			context = "some_context",
			either = TE.left(error)

		const sut = await withFailureContext(context)(either)

		onLeft(await sut(), equals("[SOME_CONTEXT] some_error"))
	})
})
