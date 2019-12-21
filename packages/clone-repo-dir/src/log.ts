const log: <T>(tag: string) => (thing: T) => T = tag => thing => {
	console.log(`👉 [${tag}]`, thing, "👈")
	return thing
}
export default log
