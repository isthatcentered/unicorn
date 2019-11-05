import * as TE from "fp-ts/lib/TaskEither"
import { tryCatch } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/pipeable"
import { concat } from "ramda"

export const withCatchEither = <E>(mapLeft: (e: any) => E) => <
	A extends any[],
	T
>(
	action: (...args: A) => Promise<T>,
) => (...args: A): TE.TaskEither<E, T> =>
	tryCatch(() => action(...args), mapLeft)

export const withFailureContext = (context: string) => <E, T>(
	ma: TE.TaskEither<string, T>,
): TE.TaskEither<string, T> =>
	pipe(
		ma,
		TE.mapLeft(concat(`[${context.toUpperCase()}] `)),
	)
