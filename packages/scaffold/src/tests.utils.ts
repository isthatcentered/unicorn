import { pipe } from "fp-ts/lib/pipeable"
import * as ETR from "fp-ts/lib/Either"

export const onLeft = <E, T>(
	either: ETR.Either<E, T>,
	verify: (error: E) => void,
) =>
	pipe(
		either,
		ETR.mapLeft(verify),
	)
export const onRight = <E, T>(
	either: ETR.Either<E, T>,
	verify: (val: T) => void,
) =>
	pipe(
		either,
		ETR.map(verify),
	)

export function equals<T>(a: T) {
	return (b: T) => {
		expect(a).toEqual(b)
	}
}

export function fails() {
	return fail("Code path should not have been triggered")
}

export function resolves<T>(data?: T) {
	return () => Promise.resolve(data)
}

export function rejects<T>(data?: T) {
	return () => Promise.reject(data)
}
