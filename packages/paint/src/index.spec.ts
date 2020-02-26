import paint from "./"

test(`Merges classes with a spac in between`, () => {
	const result = paint({ className: "hello" }, { className: "world" })
	expect(result.className).toBe("hello world")
})

test(`Merges override styles on top of default ones`, () => {
	const defaultBackground = "red",
		overrideBackground = "blue"

	const result = paint(
		{ style: { background: defaultBackground } },
		{ style: { background: overrideBackground } },
	)

	expect(result.style!.background).toBe(overrideBackground)
})
