const log: (tag: string) => <T>(thing: T) => T = tag => thing => {
	console.log(`👉 [${tag}]`, thing, `👈`)
	return thing
}

export default log
