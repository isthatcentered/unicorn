import * as TE from "fp-ts/lib/TaskEither"
import * as Ei from "fp-ts/lib/Either"
import log from "./log"
import { when as jestWhen, WhenMock } from "jest-when"
import { identity } from "ramda"
import { DeepPartial } from "utility-types"
import { pipe } from "fp-ts/lib/pipeable"
import { flow } from "fp-ts/lib/function"

export const WHATEVER = "WHATEVER" as any

export const shouldNotBeReached = fail

export const is: (a: any) => (b: any) => void = a => b => {
	expect(b).toBe(a)
}

export const equals: (a: any) => (b: any) => void = a => b => {
	expect(b).toEqual(a)
}

export const matchesObject: (a: any) => (b: any) => void = a => b => {
	expect(b).toMatchObject(a)
}

export const doesntMatchesObject: (a: any) => (b: any) => void = a => b => {
	expect(b).not.toMatchObject(a)
}

/**
 * [ Either]
 *
 *
 */
export const onLeft = <E>(verify: (value: E) => void) =>
	Ei.fold(verify, d => {
		log("Unexpected Right")(d)
		shouldNotBeReached(`Got a Right, of "${JSON.stringify(d)}" expected a left`)
	})

export const onRight = <E>(verify: (value: E) => void) =>
	Ei.fold(d => {
		log("Unexpected left")(d)
		shouldNotBeReached(`Got a Left, of "${JSON.stringify(d)}" expected a Right`)
	}, verify)

/**
 * [ TaskEither ]
 *
 *
 */
export const onTaskLeft = <E>(verify: (value: E) => void) => (
	task: TE.TaskEither<E, any>,
): Promise<void> => {
	return task().then(
		Ei.fold(verify, d => {
			log("Unexpected Right")(d)
			shouldNotBeReached(
				`Got a Right, of "${JSON.stringify(d)}" expected a left`,
			)
		}),
	)
}

export const onTaskRight = <E>(verify: (value: E) => void) => (
	task: TE.TaskEither<E, any>,
): Promise<void> => {
	return task().then(
		Ei.fold(d => {
			log("Unexpected left")(d)
			shouldNotBeReached(
				`Got a Left, of "${JSON.stringify(d)}" expected a Right`,
			)
		}, verify),
	)
}

/**
 * [ Mock Helpers ]
 *
 *
 */
export type Mock<T extends (...args: any[]) => any> = T extends (
	...args: infer A
) => infer R
	? jest.Mock<R, A>
	: never
const unsafeCoerce: <A, B>() => (a: A) => B = () => identity as any
type anyFn = (...args: any[]) => any
export const mocked: <T extends anyFn>(thing: T) => Mock<T> = unsafeCoerce()
export const Fake: <T>(name: DeepPartial<T> | string) => T = unsafeCoerce()
export const when: <T, A extends any[]>(
	thing: (...args: A) => T,
) => WhenMock<T, A> = thing => jestWhen(mocked(thing))
