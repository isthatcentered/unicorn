import { assert as assertType, Has, IsExact } from "conditional-type-checks"
import { opaque } from "."

describe(`Opaque`, () => {
	interface Eur {
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
		readonly EUR: unique symbol
	}

	test(`"foldMap" unwraps the value and transforms it`, () => {
		const { foldMap, of } = opaque<Eur, number>(),
			toDisplayValue: (n: number) => string = n => n.toString() + "€"

		const result = foldMap(toDisplayValue)(of(4))

		expect(result).toBe("4€")

		assertType<IsExact<typeof result, string>>(true)
	})

	test(`"map" applies a transformation to the opaque`, () => {
		const { map, of, fold } = opaque<Eur, number>(),
			mutlitplyBy2 = (n: number) => n * 2

		const result = map(mutlitplyBy2)(of(4))

		expect(fold(result)).toBe(8)

		assertType<IsExact<typeof result, Eur>>(true)
	})

	test(`"of" wraps value`, () => {
		const { of, fold } = opaque<Eur, number>()

		const result = of(4)

		expect(fold(result)).toBe(4)

		assertType<IsExact<typeof result, Eur>>(true)
	})

	test(`"fold" unwraps value`, () => {
		const { of, fold } = opaque<Eur, number>()

		const result = fold(of(4))

		expect(result).toBe(4)

		assertType<IsExact<typeof result, number>>(true)
	})

	test(`An opaque type cannot pass for another`, () => {
		interface Eur {
			// ------ Both have Eur as Id
			readonly EUR: unique symbol
		}
		interface Doll {
			// ------ Both have Eur as Id
			readonly EUR: unique symbol
		}

		const eur = opaque<Eur, number>()
		const doll = opaque<Doll, number>()

		const wrappedEur: Eur = eur.of(3)

		const wrappedDoll: Doll = doll.of(3)

		assertType<Has<typeof wrappedDoll, Eur>>(false)
		assertType<Has<typeof wrappedEur, Doll>>(false)

		expect(true).toBe(true)
	})
})
