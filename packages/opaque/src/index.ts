const identity = <A>(a: A): A => a

type Opaque<ID, T> = {
	wrap: (data: T) => ID
	unwrap: (id: ID) => T
	unwrapMap: <B>(fa: (a: T) => B) => (id: ID) => B
	map: (fa: (a: T) => T) => (id: ID) => ID
}

function opaque<ID, T>(): Opaque<ID, T> {
	const wrap: Opaque<ID, T>["wrap"] = identity as any
	const unwrap: Opaque<ID, T>["unwrap"] = identity as any
	const unwrapMap: Opaque<ID, T>["unwrapMap"] = fa => id => fa(unwrap(id))
	const map: Opaque<ID, T>["map"] = fa => id => wrap(fa(unwrap(id)))

	return {
		wrap,
		unwrap,
		unwrapMap,
		map,
	}
}
export default opaque
