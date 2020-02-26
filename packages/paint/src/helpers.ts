const defaultTo = <T>(defaultValue: T) => (thing: T | undefined): T =>
	thing || defaultValue

const defaultToEmptyString = defaultTo<string>("")

export const mergeClassnames = (a: string | undefined) => (
	b: string | undefined,
): string =>
	defaultToEmptyString(a)
		.concat(" ")
		.concat(defaultToEmptyString(b))

export const shallowMerge = <T extends Record<any, any> | undefined>(
	defaults: T,
) => (overrides: T): T => ({
	...defaults,
	...overrides,
})
